import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["link", "image", "video", "pdf", "tweet", "website"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    contentText: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    embeddingId: {
      type: String,
      required: false,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
