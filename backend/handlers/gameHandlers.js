const rooms = require("../data/rooms");
const startRound = require("../game/startRound");
const startTimer = require("../game/timer");

module.exports = (io, socket) => {
  socket.on("start_game", ({ roomId }) => {
    const room = rooms[roomId];

    if (!room) return;

    if (room.host !== socket.id) return;

    room.gameStarted = true;

    room.currentRound = 1;
    room.currentTurn = 0;

    io.to(roomId).emit("game_started");

    startRound(io, roomId);
  });

  socket.on("game_ready", ({ roomId }) => {
    const room = rooms[roomId];

    if (!room) return;

    if (!room.waitingForWordChoice) return;

    if (room.host !== socket.id) return;

    io.to(room.host).emit("choose_word", {
      wordOptions: room.wordOptions,
    });

    room.waitingForWordChoice = false;
  });

  socket.on("choose_word", ({ roomId, word }) => {
    const room = rooms[roomId];

    if (!room) return;

    room.currentWord = word;
    // room.waitingForWordChoice = false;

    io.to(roomId).emit("word_selected", {
      wordLength: word.length,
    });

    io.to(roomId).emit("game_state", {
      phase: "drawing",
      currentRound: room.currentRound,
      totalRounds: room.totalRounds,
      drawer: room.players[room.currentTurn].name,
      drawerId: room.drawerId,
      drawTime: room.settings.drawTime,
      settings: room.settings,
      wordLength: word.length,
    });

    startTimer(io, roomId, room, () => {
      startRound(io, roomId);
    });
  });
};
