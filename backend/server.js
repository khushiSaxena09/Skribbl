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

app.use(cors({
  origin: "https://skribbl-pink.vercel.app",
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://skribbl-pink.vercel.app",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  [
    roomHandlers,
    gameHandlers,
    drawHandlers,
    chatHandlers,
    disconnectHandlers,
  ].forEach((handler) => handler(io, socket));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});