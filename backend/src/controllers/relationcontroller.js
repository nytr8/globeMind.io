import itemModel from "../models/item.model.js";
import relationModel from "../models/relation.model.js";

export const getGraph = async (req, res) => {
  try {
    const userId = req.user.id;

    const relations = await relationModel.find({ userId }).lean();

    const itemIds = [
      ...new Set(relations.flatMap((r) => [String(r.itemA), String(r.itemB)])),
    ];

    const items = await itemModel
      .find({
        _id: { $in: itemIds },
        userId,
      })
      .select("_id title")
      .lean();

    const itemById = new Map(items.map((item) => [String(item._id), item]));

    const validRelations = relations.filter((relation) => {
      const source = String(relation.itemA);
      const target = String(relation.itemB);
      return itemById.has(source) && itemById.has(target);
    });

    const nodes = items.map((item) => ({
      id: String(item._id),
      label: item.title,
    }));

    const dedupedLinks = new Map();
    for (const relation of validRelations) {
      const source = String(relation.itemA);
      const target = String(relation.itemB);
      const key = [source, target].sort().join("::");
      const similarity = Number(relation.similarity) || 0;

      if (!dedupedLinks.has(key) || similarity > dedupedLinks.get(key).value) {
        dedupedLinks.set(key, {
          source,
          target,
          value: similarity,
        });
      }
    }

    const links = [...dedupedLinks.values()];

    res.json({ message: "graph fetched succesfully", nodes, links });
  } catch (err) {
    res.status(500).json({ message: "Graph fetch failed" });
  }
};
