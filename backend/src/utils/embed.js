import { MistralAIEmbeddings } from "@langchain/mistralai";
export const generateEmbeddings = async (chunks) => {
  const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed",
  });
  const docs = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await embeddings.embedQuery(chunk);
      return {
        text: chunk,
        embedding,
      };
    }),
  );
  console.log(docs);
  return docs;
};
