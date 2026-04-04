import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";
export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
export const storeVectors = async (vectors, userId) => {
  const index = pc.index("cohort-rag").namespace(userId.toString());
  console.log("Storing vectors...");
  await index.upsert({
    records: vectors.map((v) => ({
      id: v.id, // ✅ unique id
      values: v.vector, // ✅ embedding array
      metadata: v.metadata, // ✅ full metadata
    })),
  });
};
