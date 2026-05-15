
// import { Server, Socket } from 'socket.io';
// import { Server as HTTPServer } from 'http';
// import { RoomManager } from './rooms/Room';

// let io: Server;

// export const initSocket = (server: HTTPServer) => {
//   io = new Server(server, {
//     // ✅ FIXED: Specific Vercel origin (not '*')
//     cors: { 
//       origin: 'https://skribbl-pink.vercel.app',
//       methods: ['GET', 'POST'],
//       credentials: true
//     },
//     // ✅ Render WebSocket optimization
//     pingTimeout: 60000,
//     pingInterval: 25000,
//     transports: ['websocket', 'polling']
//   });

//   io.on('connection', (socket: Socket) => {
//     console.log(`✅ Client connected: ${socket.id}`);

//     // ==========================================
//     // CREATE ROOM
//     // ==========================================
//     socket.on('create_room', ({ hostName, settings = {} }) => {
//       const roomId = Math.random()
//         .toString(36)
//         .substring(2, 8)
//         .toUpperCase();

//       const defaultSettings = {
//         rounds: settings.rounds || 3,
//         drawTime: settings.drawTime || 60,
//         maxPlayers: settings.maxPlayers || 12,
//         hints: settings.hints || 0
//       };

//       const room = RoomManager.create(roomId, socket.id, hostName, defaultSettings, io);
      
//       socket.join(roomId);

//       socket.emit('room_created', {
//         roomId,
//         playerId: socket.id,
//         players: room.players,
//         settings: defaultSettings
//       });

//       console.log(`🏠 Room created: ${roomId} by ${hostName}`);
//     });

//     // ==========================================
//     // JOIN ROOM
//     // ==========================================
//     socket.on('join_room', ({ roomId, playerName }) => {
//       const room = RoomManager.get(roomId);
      
//       if (!room) {
//         socket.emit('error', { message: 'Room not found' });
//         return;
//       }

//       if (room.players.length >= room.settings.maxPlayers) {
//         socket.emit('error', { message: 'Room is full' });
//         return;
//       }

//       room.addPlayer(socket.id, playerName);
//       socket.join(roomId);

//       io.to(roomId).emit('players_update', { players: room.players });
//       socket.emit('joined_room', {
//         roomId,
//         playerId: socket.id,
//         players: room.players,
//         settings: room.settings
//       });

//       console.log(`👤 ${playerName} (${socket.id}) joined room ${roomId}`);
//     });

//     // ==========================================
//     // GAME EVENTS
//     // ==========================================
//     socket.on('room_event', ({ roomId, event, data = {} }) => {
//       const room = RoomManager.get(roomId);
//       if (!room) {
//         console.log(`⚠️ Room ${roomId} not found`);
//         socket.emit('error', { message: 'Room not found' });
//         return;
//       }

//       room.handleEvent(event, socket.id, data);
//     });

//     // ==========================================
//     // DISCONNECT
//     // ==========================================
//     socket.on('disconnect', () => {
//       console.log(`❌ Client disconnected: ${socket.id}`);

//       for (let roomId of RoomManager.getAllRoomIds()) {
//         const room = RoomManager.get(roomId);
//         if (room && room.removePlayer(socket.id)) {
//           if (room.players.length === 0) {
//             RoomManager.remove(roomId);
//             console.log(`🗑️ Room deleted: ${roomId}`);
//           } else {
//             io.to(roomId).emit('players_update', { players: room.players });
//           }
//           break;
//         }
//       }
//     });
//   });

//   console.log('🔌 Socket.IO server ready!');
// };

// export const getIo = () => io;


import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RoomManager } from './rooms/Room';
import { RoomModel } from './models/RoomModel';

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: 'https://skribbl-pink.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // ==========================================
    // CREATE ROOM
    // ==========================================
    socket.on('create_room', async ({ hostName, settings = {} }) => {
      const roomId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const defaultSettings = {
        rounds: settings.rounds || 3,
        drawTime: settings.drawTime || 60,
        maxPlayers: settings.maxPlayers || 12,
        hints: settings.hints || 0
      };

      const room = RoomManager.create(
        roomId,
        socket.id,
        hostName,
        defaultSettings,
        io
      );

      socket.join(roomId);

      // ✅ SAVE TO MONGODB (PUBLIC ROOMS)
      try {
        await RoomModel.create({
          roomId,
          hostId: socket.id,
          hostName,
          isPublic: true,
          isGameStarted: false,
          settings: defaultSettings,
          players: [
            {
              id: socket.id,
              name: hostName,
              score: 0,
              ready: false
            }
          ]
        });
      } catch (err) {
        console.error("❌ Room DB save error:", err);
      }

      socket.emit('room_created', {
        roomId,
        playerId: socket.id,
        players: room.players,
        settings: defaultSettings
      });

      console.log(`🏠 Room created: ${roomId} by ${hostName}`);
    });

    // ==========================================
    // JOIN ROOM
    // ==========================================
    socket.on('join_room', async ({ roomId, playerName }) => {
      const room = RoomManager.get(roomId);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (room.players.length >= room.settings.maxPlayers) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }

      room.addPlayer(socket.id, playerName);
      socket.join(roomId);

      // ✅ UPDATE DB
      try {
        await RoomModel.updateOne(
          { roomId },
          {
            $push: {
              players: {
                id: socket.id,
                name: playerName,
                score: 0,
                ready: false
              }
            }
          }
        );
      } catch (err) {
        console.error("❌ Room join DB update error:", err);
      }

      io.to(roomId).emit('players_update', { players: room.players });

      socket.emit('joined_room', {
        roomId,
        playerId: socket.id,
        players: room.players,
        settings: room.settings
      });

      console.log(`👤 ${playerName} (${socket.id}) joined room ${roomId}`);
    });

    // ==========================================
    // GAME EVENTS
    // ==========================================
    socket.on('room_event', ({ roomId, event, data = {} }) => {
      const room = RoomManager.get(roomId);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      room.handleEvent(event, socket.id, data);
    });

    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on('disconnect', async () => {
      console.log(`❌ Client disconnected: ${socket.id}`);

      for (let roomId of RoomManager.getAllRoomIds()) {
        const room = RoomManager.get(roomId);

        if (room && room.removePlayer(socket.id)) {
          try {
            // ✅ REMOVE FROM DB
            await RoomModel.updateOne(
              { roomId },
              { $pull: { players: { id: socket.id } } }
            );
          } catch (err) {
            console.error("❌ Room disconnect DB update error:", err);
          }

          if (room.players.length === 0) {
            RoomManager.remove(roomId);
            console.log(`🗑️ Room deleted: ${roomId}`);

            // optional cleanup in DB
            try {
              await RoomModel.deleteOne({ roomId });
            } catch (err) {
              console.error("❌ Room delete DB error:", err);
            }
          } else {
            io.to(roomId).emit('players_update', {
              players: room.players
            });
          }

          break;
        }
      }
    });
  });

  console.log('🔌 Socket.IO server ready!');
};

export const getIo = () => io;