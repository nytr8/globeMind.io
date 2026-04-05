import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
export const splitIntoChunks = async (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 10,
  });

  const chunks = await splitter.splitText(text);

  console.log(`Generated ${chunks.length} chunks`);
  return chunks;
};
