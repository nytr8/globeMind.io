import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
export const storeVectors = async (vectors, itemId) => {
  const index = pc.index("cohort-rag").namespace(itemId.toString());
  console.log("Storing vectors...");
  await index.upsert({
    records: vectors.map((v) => ({
      id: v.id, // ✅ unique id
      values: v.vector, // ✅ embedding array
      metadata: v.metadata, // ✅ full metadata
    })),
  });
};
