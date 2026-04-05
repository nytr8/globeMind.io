import relationModel from "../models/relation.model.js";
import { pc } from "../utils/storeVector.js";

export const generateRelations = async (itemId, userId, embedding) => {
  try {
    const index = pc.index("cohort-rag").namespace(userId.toString());

    // 🔍 search similar items
    const results = await index.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });

    // 🎯 filter strong matches
    const strongMatches = results.matches.filter((m) => m.score > 0.8);

    // ❌ remove self-match
    const filtered = strongMatches.filter(
      (m) => m.metadata.itemId !== itemId.toString(),
    );

    // 💾 save relations
    const relations = filtered.map((match) => ({
      itemA: itemId,
      itemB: match.metadata.itemId,
      similarity: match.score,
      userId,
    }));

    await relationModel.insertMany(relations);

    console.log("Relations created:", relations.length);
  } catch (err) {
    console.error("Relation error:", err);
  }
};
