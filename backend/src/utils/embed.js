import { MistralAIEmbeddings } from "@langchain/mistralai";
export const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed",
});
export const generateEmbeddings = async (chunks) => {
  try {
    const vectors = await embeddings.embedDocuments(chunks);

    const docs = chunks.map((chunk, i) => ({
      text: chunk,
      embedding: vectors[i],
    }));

    console.log(docs);
    return docs;
  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
};
