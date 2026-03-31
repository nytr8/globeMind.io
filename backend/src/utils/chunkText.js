import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const splitIntoChunks = async (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(text);

  console.log(`Generated ${chunks.length} chunks`);
  return chunks;
};
