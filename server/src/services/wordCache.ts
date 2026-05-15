import { WordModel } from "../models/wordModel";

let words: string[] = [];
let loaded = false;

export async function loadWords() {
  const data = await WordModel.find({});
  words = data.flatMap(w => w.words);
  loaded = true;
  console.log("✅ Words loaded from MongoDB");
}

export function getRandomWords(count: number) {
  if (!loaded) throw new Error("Words not loaded yet");

  return [...words]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}