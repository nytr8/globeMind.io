import itemModel from "../models/item.model.js";
import ogs from "open-graph-scraper";
import axios from "axios";
import * as cheerio from "cheerio";
import { generateTags } from "../services/ai.service.js";
import {
  fetchRedditData,
  detectType,
  twitterScrapper,
  linkedinScrapper,
} from "../utils/scrappingHelper.js";
import { isBlockedUrl } from "../utils/urlProtection.js";
import { itemQueue } from "../queues/itemQueue.js";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbedding } from "../utils/getEmbedding.js";
import { pc } from "../utils/storeVector.js";
// create items
// protected
// route-/api/createitem
export const createItem = async (req, res) => {
  const { id } = req.user;
  const { url } = req.body;

  // ── Basic validation ──
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res
      .status(400)
      .json({ message: "Only HTTP/HTTPS URLs are allowed" });
  }

  if (isBlockedUrl(url)) {
    return res.status(400).json({ message: "This URL is not allowed" });
  }

  let title = null;
  let contentText = null;
  let type = null;
  let thumbnail = null;
  let embedHtml = null;

  try {
    const lowerUrl = url.toLowerCase();

    // ==============================
    // 🐦 1. TWITTER / X
    // ==============================
    if (
      lowerUrl.includes("twitter.com") ||
      lowerUrl.includes("://x.com/") ||
      lowerUrl.includes(".x.com/")
    ) {
      const scrapedData = await twitterScrapper(url);
      title = scrapedData.title;
      contentText = scrapedData.contentText;
      embedHtml = scrapedData.embedHtml;
      type = "tweet";
    }

    // ==============================
    // 💼 2. LINKEDIN
    // ==============================
    else if (lowerUrl.includes("linkedin.com")) {
      const linkdinData = await linkedinScrapper(url);
      title = linkdinData.title;
      type = "linkedin";
      contentText = `View this content on LinkedIn`;
      thumbnail =
        "https://store-images.s-microsoft.com/image/apps.46485.9007199266245564.44dc7699-748d-4c34-ba5e-d04eb48f7960.df3dbdf7-e6b9-4d2a-a5ad-3b91e430d172";
    }
    // ==============================
    // 🟠 3. REDDIT
    // ==============================
    else if (lowerUrl.includes("reddit.com")) {
      const scrapedData = await fetchRedditData(url);
      title = scrapedData.title;
      contentText = scrapedData.contentText;
      thumbnail = scrapedData.thumbnail;
      type = scrapedData.type;
    }

    // ==============================
    // 🌐 3. DEFAULT (OG + fallback scraping)
    // ==============================
    else {
      // 🔹 STEP 1: OG Scraping
      try {
        const { result, success } = await ogs({ url });

        // Always call detectType regardless of success
        type = detectType(url, success ? result : null);

        if (success) {
          title = result?.ogTitle || null;
          contentText = result?.ogDescription || null;
          thumbnail = result?.ogImage?.[0]?.url || null;
        }
      } catch (ogsErr) {
        console.log("OGS failed:", ogsErr.message);
        type = detectType(url, null);
      }

      // 🔹 STEP 2: Fallback scraping (only if needed)
      if (!title || !contentText) {
        console.log("Using fallback scraping...");
        try {
          const { data } = await axios.get(url, {
            timeout: 5000,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            },
          });

          const $ = cheerio.load(data);

          title =
            title ||
            $('meta[property="og:title"]').attr("content") ||
            $("title").text().trim() ||
            null;

          contentText =
            contentText ||
            $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            null;

          thumbnail =
            thumbnail || $('meta[property="og:image"]').attr("content") || null;
        } catch (fallbackErr) {
          console.log("Fallback scraping failed:", fallbackErr.message);
        }
      }
    }

    // ==============================
    // 🧠 FINAL SAFETY FALLBACK
    // ==============================
    title = title?.trim() || "No title";
    contentText = contentText?.trim() || "No description";
    type = type || "link";

    // ==============================
    // 🏷️ TAG GENERATION
    // ==============================
    let tags = [];
    try {
      const textForTags = `${title} ${contentText}`;
      tags = await generateTags(textForTags);
    } catch (tagErr) {
      console.log("Tag generation failed:", tagErr.message);
      tags = [];
    }

    // ==============================
    // 💾 SAVE TO DB
    // ==============================
    const item = await itemModel.create({
      userId: id,
      type,
      contentText,
      title,
      thumbnail,
      url,
      embedHtml,
      tags,
      status: "processing",
    });

    //add to queqe
    await itemQueue.add(
      "process-item",
      { itemId: item._id },
      {
        attempts: 3, // retry 3 times
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true, // clean success jobs
        removeOnFail: false, // keep failed for debugging
      },
    );

    console.log("Job added to queue:", item._id);
    return res.status(201).json({
      message: "Item added successfully",
      item,
    });
  } catch (error) {
    console.error("ERROR:", error.message);
    return res.status(500).json({
      message: "Failed to extract metadata",
      error: error.message,
    });
  }
};

// get all items
// protected
// route-/api/getallitems
export const getAllitems = async (req, res) => {
  const { id } = req.user;
  const { sort, limit } = req.query;

  try {
    let query = itemModel.find({ userId: id });

    // ✅ Sorting (e.g. createdAt:desc)
    if (sort) {
      const [field, order] = sort.split(":");
      query = query.sort({ [field]: order === "desc" ? -1 : 1 });
    }

    // ✅ Limit (e.g. 4)
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const items = await query;

    return res.status(200).json({
      message: "items fetched successfully",
      items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

// get selected item
// protected
// route-/api/getitem/:itemId
export const getItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await itemModel.findByById(itemId);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json({ message: "item fetched succesfully", item });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch item",
      error: error.message,
    });
  }
};

// delete item
// protected
// route-/api/delete/:itemId
export const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await itemModel.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    return res.status(204).json({ message: "item deleted succesfully", item });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete item",
      error: error.message,
    });
  }
};

// resurfaced item
// protected
// route-/api/resurface
export const getResurfacedItems = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user?.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    let items = await itemModel.aggregate([
      { $match: { userId } },
      {
        $addFields: {
          effectiveViewCount: { $ifNull: ["$viewCount", 0] },
        },
      },
      { $sort: { effectiveViewCount: 1, createdAt: 1 } },
      { $limit: 3 },
    ]);

    const itemIds = items.map((item) => item._id);

    if (itemIds.length) {
      await itemModel.updateMany(
        { _id: { $in: itemIds } },
        {
          $set: { lastViewedAt: new Date() },
          $inc: { viewCount: 1 },
        },
      );

      items = items.map((item) => ({
        ...item,
        lastViewedAt: new Date(),
        viewCount: (item.viewCount ?? 0) + 1,
      }));
    }

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching resurfaced items" });
  }
};

// searched item
// protected
// route-/api/search?q="your_query"
export const searchItems = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    // 1. Embedding
    const queryVector = await getEmbedding(q);

    // 2. Pinecone search
    const index = pc.index("cohort-rag").namespace(userId.toString());

    const results = await index.query({
      vector: queryVector,
      topK: 10,
      includeMetadata: true,
    });

    console.log("Pinecone results:", results.matches);

    if (!results.matches || results.matches.length === 0) {
      return res.json({
        message: "No similar items found",
        results: [],
      });
    }

    const filteredMatches = results.matches.filter((m) => m.score > 0.75);
    // 3. Convert IDs safely
    const itemIds = [...new Set(filteredMatches.map((m) => m.metadata.itemId))];
    // 4. Fetch from MongoDB
    const items = await itemModel.find({
      _id: { $in: itemIds },
    });

    // 5. Preserve order
    const itemsMap = new Map(items.map((item) => [item._id.toString(), item]));

    const orderedItems = itemIds
      .map((id) => itemsMap.get(id.toString()))
      .filter(Boolean);

    // 6. Response
    res.json({
      message: "Items searched successfully",
      query: q,
      results: orderedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};
