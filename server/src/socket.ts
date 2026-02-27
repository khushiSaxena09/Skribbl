
// import { Server, Socket } from 'socket.io';
// import { Server as HTTPServer } from 'http';
// import { RoomManager } from './rooms/Room';

// let io: Server;

// export const initSocket = (server: HTTPServer) => {
//   io = new Server(server, {
//     cors: { origin: '*', methods: ['GET', 'POST'] },
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

//       console.log(`👤 ${playerName} joined room ${roomId}`);
//     });

//     // ==========================================
//     // GAME EVENTS (FIXED)
//     // ==========================================
//     socket.on('room_event', ({ roomId, event, data = {} }) => {
//       const room = RoomManager.get(roomId);
//       if (!room) {
//         socket.emit('error', { message: 'Room not found' });
//         return;
//       }

//       // ✅ FIXED: Pass data to room.handleEvent
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
// };

// export const getIo = () => io;
import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RoomManager } from './rooms/Room';

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    // ✅ FIXED: Specific Vercel origin (not '*')
    cors: { 
      origin: 'https://skribbl-pink.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true
    },
    // ✅ Render WebSocket optimization
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // ==========================================
    // CREATE ROOM
    // ==========================================
    socket.on('create_room', ({ hostName, settings = {} }) => {
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

      const room = RoomManager.create(roomId, socket.id, hostName, defaultSettings, io);
      socket.join(roomId);

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
    socket.on('join_room', ({ roomId, playerName }) => {
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
        console.log(`⚠️ Room ${roomId} not found`);
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      room.handleEvent(event, socket.id, data);
    });

    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);

      for (let roomId of RoomManager.getAllRoomIds()) {
        const room = RoomManager.get(roomId);
        if (room && room.removePlayer(socket.id)) {
          if (room.players.length === 0) {
            RoomManager.remove(roomId);
            console.log(`🗑️ Room deleted: ${roomId}`);
          } else {
            io.to(roomId).emit('players_update', { players: room.players });
          }
          break;
        }
      }
    });
  });

  console.log('🔌 Socket.IO server ready!');
};

export const getIo = () => io;


// import { Server, Socket } from 'socket.io';
// import { Server as HTTPServer } from 'http';
// import { RoomManager } from './rooms/Room';

// let io: Server;

// export const initSocket = (server: HTTPServer) => {
//   io = new Server(server, {
//     cors: { origin: '*', methods: ['GET', 'POST'] },
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
// };

// export const getIo = () => io;