const rooms = require("../data/rooms");
const generateRoomId = require("../utils/generateRoomId");
const getPublicRooms = require("../utils/getPublicRooms");

module.exports = (io, socket) => {
  // CREATE ROOM
  socket.on("create_room", ({ playerName, isPublic, settings }) => {
    // VALIDATION
    if (
      !settings?.maxPlayers ||
      !settings?.rounds ||
      !settings?.drawTime ||
      !settings?.wordChoices ||
      settings?.hints === undefined ||
      !settings?.wordMode
    ) {
      return socket.emit("error_message", "Please select all room settings");
    }

    const roomId = generateRoomId();

    rooms[roomId] = {
      roomId,
      isPublic,
      host: socket.id,

      settings: {
        maxPlayers: settings?.maxPlayers,
        rounds: settings?.rounds,
        drawTime: settings?.drawTime,
        wordChoices: settings?.wordChoices,
        hints: settings?.hints,
        wordMode: settings?.wordMode,
      },

      players: [
        {
          id: socket.id,
          name: playerName,
          score: 0,
          ready: false,
        },
      ],

      currentRound: 1,
      totalRounds: settings?.rounds,
      currentTurn: 0,
      drawerId: null,
      currentWord: "",
      gameStarted: false,
    };

    socket.join(roomId);

    socket.emit("room_created", rooms[roomId]);

    // UPDATE ALL USERS
    io.emit("rooms_updated");

    // SEND PUBLIC ROOMS TO EVERYONE
    io.emit("public_rooms", getPublicRooms());
  });

  // GET PUBLIC ROOMS
  socket.on("get_public_rooms", () => {
    socket.emit("public_rooms", getPublicRooms());
  });

  // JOIN ROOM
  socket.on("join_room", ({ roomId, playerName }) => {
    const room = rooms[roomId];

    if (!room) {
      return socket.emit("error_message", "Room not found");
    }

    if (room.players.length >= room.settings.maxPlayers) {
      return socket.emit("error_message", "Room is full!");
    }

    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      ready: false,
    };

    room.players.push(player);

    socket.join(roomId);

    io.to(roomId).emit("player_joined", room);

    // UPDATE ALL USERS
    io.emit("rooms_updated");

    // UPDATE PUBLIC ROOMS LIVE
    io.emit("public_rooms", getPublicRooms());
  });

};
