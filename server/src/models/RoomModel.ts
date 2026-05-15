// import mongoose, { Schema } from 'mongoose';

// const RoomSchema = new Schema(
//   {
//     roomId: { type: String, required: true, unique: true, index: true },
//     hostId: { type: String, required: true },
//     hostName: { type: String, required: true },
//     isPublic: { type: Boolean, default: false },
//     isGameStarted: { type: Boolean, default: false },
//     playerCount: { type: Number, default: 1 },
//     settings: {
//       rounds: { type: Number, default: 3, min: 2, max: 10 },
//       drawTime: { type: Number, default: 60, min: 15, max: 240 },
//       maxPlayers: { type: Number, default: 12, min: 2, max: 20 },
//       hints: { type: Number, default: 0, min: 0, max: 5 },
//       wordCount: { type: Number, default: 3, min: 1, max: 5 },
//       wordMode: { type: String, default: 'normal' }
//     }
//   },
//   { timestamps: true }
// );

// export const RoomModel = mongoose.model('Room', RoomSchema);

import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    hostId: { type: String, required: true },
    hostName: { type: String, required: true },

    isPublic: { type: Boolean, default: false },
    isGameStarted: { type: Boolean, default: false },

    playerCount: { type: Number, default: 1 },

    settings: {
      rounds: { type: Number, min: 2, max: 10, default: 3 },
      drawTime: { type: Number, min: 15, max: 240, default: 60 },
      maxPlayers: { type: Number, min: 2, max: 20, default: 12 },
      hints: { type: Number, min: 0, max: 5, default: 0 },
      wordCount: { type: Number, min: 1, max: 5, default: 3 },
      wordMode: { type: String, default: "normal" }
    },

    players: [
      {
        id: String,
        name: String,
        score: Number,
        ready: Boolean
      }
    ]
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model("Room", RoomSchema);