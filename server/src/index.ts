// import express from 'express';
// import { createServer } from 'http';
// import cors from 'cors';
// import { initSocket } from './socket';
// import path from 'path';

// const app = express();
// const server = createServer(app);

// app.use(cors({ origin: '*' }));
// app.use(express.json());

// // Serve static files from client build
// const clientPath = path.join(__dirname, '../../client/dist');
// app.use(express.static(clientPath));

// // API Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// // Fallback to index.html for SPA
// app.get('*', (req, res) => {
//   res.sendFile(path.join(clientPath, 'index.html'));
// });

// // ⚡ Attach Socket.IO BEFORE server.listen
// initSocket(server);

// const PORT = process.env.PORT || 3001 ;
// server.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

// export default server;


import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initSocket } from './socket';

const app = express();
const server = createServer(app);

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
