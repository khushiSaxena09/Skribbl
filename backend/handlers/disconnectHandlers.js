const rooms = require("../data/rooms");
const getPublicRooms = require("../utils/getPublicRooms");

module.exports = (io, socket) => {

  socket.on("disconnect", () => {
    for (const roomId in rooms) {

      const room = rooms[roomId];

      room.players = room.players.filter(
        (player) => player.id !== socket.id
      );

      io.to(roomId).emit("player_left", {
        playerId: socket.id,
        players: room.players,
      });

      // DELETE EMPTY ROOM
      if (room.players.length === 0) {

        delete rooms[roomId];

      } else {

        // CHANGE HOST
        if (room.host === socket.id) {
          room.host = room.players[0].id;
        }

        io.to(roomId).emit("player_joined", room);
      }
    }

    // UPDATE ALL USERS
    io.emit("rooms_updated");

    // UPDATE PUBLIC ROOMS
    io.emit("public_rooms", getPublicRooms());

  });

};