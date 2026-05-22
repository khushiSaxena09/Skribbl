const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const roomHandlers = require("./handlers/roomHandlers");
const gameHandlers = require("./handlers/gameHandlers");
const drawHandlers = require("./handlers/drawHandlers");
const chatHandlers = require("./handlers/chatHandlers");
const disconnectHandlers = require("./handlers/disconnectHandlers");

const app = express();

app.use(cors());

const server = http.createServer(app);

app.use(cors({
  origin: "https://skribbl-pink.vercel.app",
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: "https://skribbl-pink.vercel.app",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // LOOP ALL HANDLERS
  [
    roomHandlers,
    gameHandlers,
    drawHandlers,
    chatHandlers,
    disconnectHandlers,
  ].forEach((handler) => handler(io, socket));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
