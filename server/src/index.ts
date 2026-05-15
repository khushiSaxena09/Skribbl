import { loadWords } from "./services/wordCache";
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initSocket } from './socket';

const app = express();
const server = createServer(app);

const startServer = async () => {
  await loadWords();

  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

startServer();

// ✅ CORS for your Vercel frontend
app.use(cors({ 
  origin: 'https://skribbl-pink.vercel.app',
  credentials: true 
}));

app.use(express.json());

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ❌ REMOVE THESE (Vercel handles frontend):
// app.use(express.static(clientPath));
// app.get('*', ...)

initSocket(server);  // Socket.IO first!

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
