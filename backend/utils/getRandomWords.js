const words = require("../data/words");

function getRandomWords(count = 3) {
  const shuffled = [...words].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
}

module.exports = getRandomWords;