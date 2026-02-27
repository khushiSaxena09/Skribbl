// import express from 'express';
// import { createServer } from 'http';
// import cors from 'cors';
// import { initSocket } from './socket';
// import path from 'path';

// const app = express();
// const server = createServer(app);

// app.use(cors({ origin: '*' }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../../client/dist')));

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   initSocket(server);
// });


import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initSocket } from './socket';
import path from 'path';

const app = express();
const server = createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve static files from client build
const clientPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientPath));

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  initSocket(server);
});

export default server;