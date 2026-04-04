import { embeddings } from "./embed.js";

export const getEmbedding = async (text) => {
  try {
    return await embeddings.embedQuery(text);
  } catch (error) {
    console.error("Query embedding error:", error);
    throw error;
  }
};
