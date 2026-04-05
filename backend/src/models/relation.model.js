import mongoose from "mongoose";

const relationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    similarity: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  },
);

const relationModel = mongoose.model("Relation", relationSchema);

export default relationModel;
