const rooms = require("../data/rooms");
const normalizeWord = require("../utils/normalizeWord");

module.exports = (io, socket) => {

  socket.on("send_message", ({ roomId, message }) => {

    const room = rooms[roomId];

    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);

    if (!player) return;

    if (room.drawerId === socket.id) {
      return;
    }

    const normalizedMessage = normalizeWord(message);

    const normalizedWord = normalizeWord(room.currentWord);

    if (normalizedMessage === normalizedWord) {

      if (room.guessedPlayers.includes(socket.id)) {
        return;
      }

      room.guessedPlayers.push(socket.id);

      player.score += 10;

      io.to(roomId).emit("correct_guess", {
        playerName: player.name,
        score: player.score,
        players: room.players,
      });

    } else {

      io.to(roomId).emit("chat_message", {
        playerName: player.name,
        message,
      });

    }
  });

};