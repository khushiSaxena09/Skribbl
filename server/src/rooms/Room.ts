
// import { Server } from 'socket.io';
// import { Game } from './Game';

// export type PlayerType = {
//   id: string;
//   name: string;
//   ready: boolean;
//   score: number;
// };

// export class Room {
//   roomId: string;
//   players: PlayerType[] = [];
//   settings: any;
//   io: Server;
//   game: Game | null = null;
//   isGameStarted = false;

//   constructor(roomId: string, hostId: string, hostName: string, settings: any, io: Server) {
//     this.roomId = roomId;
//     this.io = io;
//     this.settings = {
//       rounds: 3,
//       drawTime: 60,
//       maxPlayers: 12,
//       hints: 0,
//       ...settings
//     };
//     this.players.push({ id: hostId, name: hostName, ready: false, score: 0 });
//   }

//   addPlayer(id: string, name: string) {
//     if (this.players.length < this.settings.maxPlayers) {
//       this.players.push({ id, name, ready: false, score: 0 });
//       this.broadcast('players_update', { players: this.players });
//     }
//   }

//   removePlayer(id: string): boolean {
//     const index = this.players.findIndex(p => p.id === id);
//     if (index > -1) {
//       this.players.splice(index, 1);
//       this.broadcast('players_update', { players: this.players });
//       return true;
//     }
//     return false;
//   }

//   setPlayerReady(id: string) {
//     const player = this.players.find(p => p.id === id);
//     if (player) {
//       player.ready = true;
//     }
//     this.broadcast('players_update', { players: this.players });
//   }

//   areAllReady(): boolean {
//     return this.players.length >= 2 && this.players.every(p => p.ready);
//   }

//   startGame() {
//     if (this.isGameStarted) return;
//     this.isGameStarted = true;
//     this.game = new Game(this);
//     this.game.start();
//   }

//   handleEvent(event: string, playerId: string, data: any) {
//     if (!this.game) {
//       if (event === 'player_ready') {
//         this.setPlayerReady(playerId);
//         if (this.areAllReady()) {
//           console.log(`🎮 Game starting in room ${this.roomId}`);
//           this.startGame();
//         }
//       }
//       return;
//     }
//     this.game.handleEvent(event, playerId, data);
//   }

//   broadcast(event: string, payload: any) {
//     this.io.to(this.roomId).emit(event, payload);
//   }

//   broadcastExcept(event: string, payload: any, exceptId: string) {
//     this.io.to(this.roomId).emit(event, { ...payload, exceptId });
//   }
// }

// export class RoomManager {
//   private static rooms = new Map<string, Room>();

//   static create(roomId: string, hostId: string, hostName: string, settings: any, io: Server) {
//     const room = new Room(roomId, hostId, hostName, settings, io);
//     this.rooms.set(roomId, room);
//     return room;
//   }

//   static get(roomId: string): Room | undefined {
//     return this.rooms.get(roomId);
//   }

//   static getAllRoomIds(): string[] {
//     return Array.from(this.rooms.keys());
//   }

//   static remove(roomId: string) {
//     this.rooms.delete(roomId);
//   }

//   static getPublicRooms() {
//     return Array.from(this.rooms.values())
//       .filter(room => !room.isGameStarted)
//       .map(room => ({
//         roomId: room.roomId,
//         playerCount: room.players.length,
//         maxPlayers: room.settings.maxPlayers,
//         hostName: room.players[0]?.name || 'Unknown'
//       }));
//   }
// }

import { Server } from 'socket.io';
import { Game } from './Game';

export type PlayerType = {
  id: string;
  name: string;
  ready: boolean;
  score: number;
};

export class Room {
  roomId: string;
  players: PlayerType[] = [];
  settings: any;
  io: Server;
  game: Game | null = null;
  isGameStarted = false;

  constructor(roomId: string, hostId: string, hostName: string, settings: any, io: Server) {
    this.roomId = roomId;
    this.io = io;
    this.settings = {
      rounds: 3,
      drawTime: 60,
      maxPlayers: 12,
      hints: 0,
      ...settings
    };
    this.players.push({ id: hostId, name: hostName, ready: false, score: 0 });
  }

  addPlayer(id: string, name: string) {
    if (this.players.length < this.settings.maxPlayers) {
      this.players.push({ id, name, ready: false, score: 0 });
      this.broadcast('players_update', { players: this.players });
    }
  }

  removePlayer(id: string): boolean {
    const index = this.players.findIndex(p => p.id === id);
    if (index > -1) {
      const removedPlayer = this.players[index];
      console.log(`👤 ${removedPlayer.name} left the room`);
      this.players.splice(index, 1);
      
      // ✅ FIXED: If game hasn't started, notify others
      if (!this.isGameStarted) {
        this.broadcast('players_update', { players: this.players });
      }
      
      return true;
    }
    return false;
  }

  setPlayerReady(id: string) {
    const player = this.players.find(p => p.id === id);
    if (player) {
      player.ready = true;
      console.log(`✅ ${player.name} is ready`);
    }
    this.broadcast('players_update', { players: this.players });
  }

  areAllReady(): boolean {
    return this.players.length >= 2 && this.players.every(p => p.ready);
  }

  startGame() {
    if (this.isGameStarted) {
      console.log(`⚠️ Game already started in room ${this.roomId}`);
      return;
    }

    if (!this.areAllReady()) {
      console.log(`⚠️ Not all players ready in room ${this.roomId}`);
      return;
    }

    console.log(`🎮 Starting game in room ${this.roomId}`);
    this.isGameStarted = true;
    this.game = new Game(this);
    this.game.start();
  }

  handleEvent(event: string, playerId: string, data: any) {
    console.log(`📨 Event: ${event} from ${playerId}`);

    // Check if player is still in room
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      console.log(`⚠️ Player ${playerId} not found in room`);
      return;
    }

    if (!this.game) {
      if (event === 'player_ready') {
        this.setPlayerReady(playerId);
        if (this.areAllReady()) {
          console.log(`🎮 All players ready! Starting game in ${this.roomId}`);
          this.startGame();
        }
      }
      return;
    }

    this.game.handleEvent(event, playerId, data);
  }

  broadcast(event: string, payload: any) {
    this.io.to(this.roomId).emit(event, payload);
  }

  broadcastExcept(event: string, payload: any, exceptId: string) {
    this.io.to(this.roomId).emit(event, { ...payload, exceptId });
  }
}

export class RoomManager {
  private static rooms = new Map<string, Room>();

  static create(roomId: string, hostId: string, hostName: string, settings: any, io: Server) {
    const room = new Room(roomId, hostId, hostName, settings, io);
    this.rooms.set(roomId, room);
    return room;
  }

  static get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  static getAllRoomIds(): string[] {
    return Array.from(this.rooms.keys());
  }

  static remove(roomId: string) {
    this.rooms.delete(roomId);
  }

  static getPublicRooms() {
    return Array.from(this.rooms.values())
      .filter(room => !room.isGameStarted)
      .map(room => ({
        roomId: room.roomId,
        playerCount: room.players.length,
        maxPlayers: room.settings.maxPlayers,
        hostName: room.players[0]?.name || 'Unknown'
      }));
  }
}