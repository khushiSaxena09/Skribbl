import words from "../words/words.json"

export function pickWords(count: number): string[] {
  return [...words].sort(() => Math.random() - 0.5).slice(0, count)
}