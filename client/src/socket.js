
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001' || "https://skribbl-sm6v.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

// ✅ DEBUG: Log all events globally
socket.onAny((eventName, ...args) => {
  if (['round_start', 'timer', 'word_chosen', 'correct_guess'].includes(eventName)) {
    console.log(`🌍 GLOBAL EVENT: ${eventName}`, args[0]);
  }
});

export default socket;