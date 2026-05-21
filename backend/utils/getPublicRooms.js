const rooms = require("../data/rooms");

function getPublicRooms() {

  return Object.values(rooms)
    .filter((room) => room.isPublic)
    .map((room) => ({
      roomId: room.roomId,
      players: room.players.length,
      host:
        room.players.find((p) => p.id === room.host)?.name || "Unknown",
    }));
}

module.exports = getPublicRooms;