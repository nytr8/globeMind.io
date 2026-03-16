import mongoose from "mongoose";

const relationSchema = new mongoose.Schema(
  {
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

const Relation = mongoose.model("Relation", relationSchema);

export default Relation;
