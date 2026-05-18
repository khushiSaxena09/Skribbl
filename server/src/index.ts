import { loadWords } from "./services/wordCache";
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initSocket } from './socket';

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // await loadWords();

  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

startServer();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initSocket(server);