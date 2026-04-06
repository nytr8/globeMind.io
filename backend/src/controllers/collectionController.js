import mongoose from "mongoose";
import collectionModel from "../models/collection.model.js";
import itemModel from "../models/item.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createCollection = async (req, res) => {
  const { id: userId } = req.user;
  const { name, type, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Collection name is required" });
  }

  try {
    const collection = await collectionModel.create({
      userId,
      name: name.trim(),
      type: type?.trim() || "general",
      description: description?.trim() || "",
    });

    return res.status(201).json({
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create collection",
      error: error.message,
    });
  }
};

export const getCollections = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const [collections, groupedItems] = await Promise.all([
      collectionModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      itemModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            collectionId: { $ne: null },
          },
        },
        { $group: { _id: "$collectionId", count: { $sum: 1 } } },
      ]),
    ]);

    const itemCountByCollection = new Map(
      groupedItems.map((entry) => [String(entry._id), entry.count]),
    );

    const collectionsWithMeta = collections.map((collection) => ({
      ...collection,
      itemCount: itemCountByCollection.get(String(collection._id)) || 0,
    }));

    return res.status(200).json({
      message: "Collections fetched successfully",
      collections: collectionsWithMeta,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch collections",
      error: error.message,
    });
  }
};

export const getCollectionById = async (req, res) => {
  const { id: userId } = req.user;
  const { collectionId } = req.params;

  if (!isValidObjectId(collectionId)) {
    return res.status(400).json({ message: "Invalid collection id" });
  }

  try {
    const collection = await collectionModel.findOne({
      _id: collectionId,
      userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const items = await itemModel
      .find({ userId, collectionId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Collection fetched successfully",
      collection,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch collection",
      error: error.message,
    });
  }
};

export const updateCollection = async (req, res) => {
  const { id: userId } = req.user;
  const { collectionId } = req.params;
  const { name, type, description } = req.body;

  if (!isValidObjectId(collectionId)) {
    return res.status(400).json({ message: "Invalid collection id" });
  }

  const updates = {};
  if (typeof name === "string") updates.name = name.trim();
  if (typeof type === "string") updates.type = type.trim() || "general";
  if (typeof description === "string") updates.description = description.trim();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No collection updates provided" });
  }

  if ("name" in updates && !updates.name) {
    return res.status(400).json({ message: "Collection name is required" });
  }

  try {
    const collection = await collectionModel.findOneAndUpdate(
      { _id: collectionId, userId },
      { $set: updates },
      { new: true },
    );

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    return res.status(200).json({
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update collection",
      error: error.message,
    });
  }
};

export const deleteCollection = async (req, res) => {
  const { id: userId } = req.user;
  const { collectionId } = req.params;

  if (!isValidObjectId(collectionId)) {
    return res.status(400).json({ message: "Invalid collection id" });
  }

  try {
    const collection = await collectionModel.findOneAndDelete({
      _id: collectionId,
      userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    await itemModel.updateMany(
      { userId, collectionId },
      { $set: { collectionId: null } },
    );

    return res.status(200).json({
      message: "Collection deleted successfully",
      collectionId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete collection",
      error: error.message,
    });
  }
};

export const addItemToCollection = async (req, res) => {
  const { id: userId } = req.user;
  const { collectionId, itemId } = req.params;

  if (!isValidObjectId(collectionId) || !isValidObjectId(itemId)) {
    return res.status(400).json({ message: "Invalid item or collection id" });
  }

  try {
    const collection = await collectionModel.findOne({
      _id: collectionId,
      userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const item = await itemModel.findOneAndUpdate(
      { _id: itemId, userId },
      { $set: { collectionId } },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({
      message: "Item added to collection",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add item to collection",
      error: error.message,
    });
  }
};

export const removeItemFromCollection = async (req, res) => {
  const { id: userId } = req.user;
  const { collectionId, itemId } = req.params;

  if (!isValidObjectId(collectionId) || !isValidObjectId(itemId)) {
    return res.status(400).json({ message: "Invalid item or collection id" });
  }

  try {
    const collection = await collectionModel.findOne({
      _id: collectionId,
      userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const item = await itemModel.findOneAndUpdate(
      { _id: itemId, userId, collectionId },
      { $set: { collectionId: null } },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in collection" });
    }

    return res.status(200).json({
      message: "Item removed from collection",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove item from collection",
      error: error.message,
    });
  }
};
