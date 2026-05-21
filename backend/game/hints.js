function generateHint(word, revealCount) {
  const wordLetters = word.split("");

  return wordLetters
    .map((char, index) => {
      if (index < revealCount) {
        return char;
      }

      return "_";
    })
    .join(" ");
}

module.exports = generateHint;