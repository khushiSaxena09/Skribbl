import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  // "https://skribbl-sm6v.onrender.com";
  "https://skribbl-1.onrender.com";

export const socket = io(SOCKET_URL);