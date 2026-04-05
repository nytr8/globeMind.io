import { Worker } from "bullmq";
import itemModel from "../models/item.model.js";
import { splitIntoChunks } from "../utils/chunkText.js";
import { storeVectors } from "../utils/storeVector.js";
import redisConnection from "../config/redisConnection.js";
import connectDB from "../config/mongodb.js";
import { generateEmbeddings } from "../utils/embed.js";
import { generateRelations } from "../services/relation.service.js";

await connectDB();
const worker = new Worker(
  "item-queue",
  async (job) => {
    const { itemId } = job.data;

    const item = await itemModel.findById(itemId);
    if (!item) throw new Error("Item not found");

    const userId = item.userId;
    if (item.status === "ready") {
      console.log("Skipping already processed item:", itemId);
      return;
    }

    console.log("Processing:", itemId);

    try {
      const textToProcess = [
        `Title: ${item.title || ""}`,
        `Content: ${item.contentText || ""}`,
        `Tags: ${(item.tags || []).join(", ")}`,
      ].join("\n\n");
      if (!textToProcess) {
        throw new Error("No content available");
      }

      // 2. Chunk text
      console.log("Chunking...");
      const chunks = await splitIntoChunks(String(textToProcess));

      // embed query
      console.log("Embedding...");
      const docs = await generateEmbeddings(chunks);

      // 3. Generate embeddings and store in vector db
      console.log("Storing vectors...");

      const vectors = docs.map((vector, index) => ({
        id: `${itemId}_${index}`, // 🔥 UNIQUE
        vector: vector.embedding,
        metadata: {
          itemId: itemId.toString(),
          userId: item.userId.toString(),
          text: chunks[index],
          title: item.title,
          tags: item.tags,
          chunkIndex: index,
        },
      }));
      console.log(
        "Vector IDs:",
        vectors.map((v) => v.id),
      );
      await storeVectors(vectors, item.userId);

      const mainEmbedding = vectors[0].vector;
      await generateRelations(itemId, userId, mainEmbedding);
      // 5. Update status
      await itemModel.findByIdAndUpdate(itemId, {
        status: "ready",
      });
    } catch (error) {
      await itemModel.findByIdAndUpdate(itemId, {
        status: "failed",
      });

      console.error(`Job failed for item ${itemId}:`, error.message);

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, //control load
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed:`, err);
});
