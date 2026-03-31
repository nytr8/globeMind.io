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
      enum: [
        "link",
        "image",
        "video",
        "pdf",
        "tweet",
        "website",
        "github",
        "linkedin",
        "article",
        "document",
        "reddit",
      ],
      required: true,
      default: "link",
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    embedHtml: {
      type: String,
      default: null,
    },
    createdAt: { type: Date, index: true },
  },
  {
    timestamps: true,
  },
);

const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
