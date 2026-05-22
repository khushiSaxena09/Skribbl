function startTimer(io, roomId, room, startRound) {
  let timeLeft = Number(room.settings.drawTime);

  // OLD TIMER CLEAR
  if (room.timer) {
    clearInterval(room.timer);
  }

  // INITIAL TIMER SEND
  io.to(roomId).emit("timer_update", {
    timeLeft,
  });

  room.timer = setInterval(() => {
    timeLeft--;

    // SEND UPDATED TIMER
    io.to(roomId).emit("timer_update", {
      timeLeft,
    });

    // ROUND END
    if (timeLeft <= 0) {
      clearInterval(room.timer);

      io.to(roomId).emit("round_end", {
        word: room.currentWord,
      });

      // CLEAR BOARD
      io.to(roomId).emit("clear_canvas");

      // NEXT ROUND
      room.currentRound++;

      // GAME OVER
      if (room.currentRound > room.totalRounds) {
        io.to(roomId).emit("game_over", {
          players: room.players,
        });

        room.gameStarted = false;
        room.currentWord = "";
        room.wordOptions = [];

        return;
      }

      // RESET ROUND DATA
      room.currentWord = "";
      room.wordOptions = [];
      room.guessedPlayers = [];
      room.waitingForWordChoice = true;

      // NEXT ROUND
      setTimeout(() => {
        startRound();
      }, 3000);

      return;
    }
  }, 1000);
}

module.exports = startTimer;
