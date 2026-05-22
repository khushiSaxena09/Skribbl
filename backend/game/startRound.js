const rooms = require("../data/rooms");
const getRandomWords = require("../utils/getRandomWords");

function startRound(io, roomId) {
  const room = rooms[roomId];

  if (!room) return;

  room.guessedPlayers = [];
  room.currentWord = "";
  room.wordOptions = [];
  io.to(roomId).emit("clear_canvas");


  const drawer = room.players[room.currentTurn];

  room.drawerId = drawer.id;

  room.wordOptions = getRandomWords(room.settings.wordChoices);
  room.waitingForWordChoice = true;

  io.to(roomId).emit("game_state", {
    phase: "choosing",
    currentRound: room.currentRound,
    totalRounds: room.totalRounds,
    drawer: drawer.name,
    drawerId: drawer.id,
    drawTime: room.settings.drawTime,
    settings: room.settings,
    wordLength: 0,
  });

  io.to(room.host).emit("choose_word", {
    wordOptions: room.wordOptions,
  });
}

module.exports = startRound;
