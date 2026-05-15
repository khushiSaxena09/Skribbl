import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db";
import { WordModel } from "./models/wordModel";
import words from "./words/words.json";

async function seed() {
  await connectDB(process.env.MONGO_URI as string);

  await WordModel.deleteMany({});
  await WordModel.insertMany(words);

  console.log("✅ Words seeded into MongoDB");
  process.exit();
}

seed();