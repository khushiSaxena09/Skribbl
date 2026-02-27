import words from "../words/words.json";

interface WordList {
  category: string;
  words: string[];
}

export function pickWords(count: number): string[] {
  // ✅ Flatten categories to single array
  const allWords: string[] = words.flatMap((category: WordList) => category.words);
  return [...allWords].sort(() => Math.random() - 0.5).slice(0, count);
}
