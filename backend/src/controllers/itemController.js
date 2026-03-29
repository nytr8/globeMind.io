import itemModel from "../models/item.model.js";
import ogs from "open-graph-scraper";
import axios from "axios";
import * as cheerio from "cheerio";
import { generateTags } from "../services/ai.service.js";

//detect content function
const detectType = (url, result) => {
  const rawType = result?.ogType || "";

  // ✅ 1. YouTube / video platforms
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.match(/\.(mp4|webm|ogg)$/)
  ) {
    return "video";
  }

  // ✅ 2. Pinterest / direct images
  if (
    url.includes("pinterest.com") ||
    url.includes("pin.it") ||
    url.match(/\.(jpg|jpeg|png|webp|gif)$/)
  ) {
    return "image";
  }

  // ✅ 3. PDFs
  if (url.match(/\.pdf$/)) {
    return "pdf";
  }

  // ✅ 4. Twitter / X
  if (url.includes("twitter.com") || url.includes("x.com")) {
    return "tweet";
  }

  // ✅ 5. OG-based fallback
  const cleanType = rawType.split(".")[0];

  if (cleanType === "video") return "video";
  if (cleanType === "article") return "link";
  if (cleanType === "website") return "website";

  // ✅ 6. Default fallback
  return "link";
};

// create items
// protected
// route-/api/createitem
export const createItem = async (req, res) => {
  const { id } = req.user;
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "url required",
    });
  }

  if (!url.startsWith("http")) {
    return res.status(400).json({
      message: "Invalid URL format",
    });
  }

  let title = null;
  let contentText = null;
  let type = null;
  let thumbnail = null;

  try {
    // ✅ STEP 1: Try Open Graph Scraper
    const { result } = await ogs({ url });
    console.log(result);
    title = result?.ogTitle || null;
    contentText = result?.ogDescription || null;
    type = detectType(url, result);
    thumbnail = result?.ogImage?.[0]?.url || null;

    // ✅ STEP 2: Fallback using axios + cheerio
    if (!title || !contentText) {
      console.log("Using fallback scraping...");

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // Title fallback
      title = title || $("title").text();

      // Description fallback
      contentText =
        contentText ||
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "No description available";

      // Thumbnail fallback
      thumbnail =
        thumbnail || $('meta[property="og:image"]').attr("content") || null;

      type = type || "website";
    }

    // ✅ STEP 3: Final fallback (NEVER NULL)
    title = title || "No title";
    contentText = contentText || "No description";
    type = type || "website";

    // generate tags
    const tags = await generateTags(title);

    // ✅ STEP 4: Save to DB
    const item = await itemModel.create({
      userId: id,
      type,
      contentText,
      title,
      thumbnail,
      url,
      tags: tags,
    });

    res.status(201).json({
      message: "item added successfully",
      item,
    });
  } catch (error) {
    console.error("ERROR:", error.message);

    res.status(500).json({
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
    const item = await itemModel.findById({ itemId });

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json(item);
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
    const item = await itemModel.findByIdAndDelete({ itemId });

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
