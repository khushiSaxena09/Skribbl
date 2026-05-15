import mongoose, { Schema } from "mongoose";

const WordSchema = new Schema(
  {
    category: { type: String, required: true },
    words: { type: [String], required: true }
  },
  { timestamps: true }
);

export const WordModel = mongoose.model("Word", WordSchema);