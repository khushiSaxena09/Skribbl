# Skribbl Clone

This is a real-time multiplayer drawing and guessing game.

---

## Live URL

Frontend (Vercel): https://your-project.vercel.app  
Backend (WebSocket): https://your-backend.onrender.com  

---

## Features

- Create and join rooms
- Draw on canvas
- Guess words in real time
- Score system
- WebSocket-based real-time updates

---

## Tech Stack

Frontend:
- React
- HTML Canvas
- Socket.IO client
- Deployed on Vercel

Backend:
- Node.js
- Express
- Socket.IO
- Deployed on Render / Railway

---

## How It Works

- Drawing data is sent using WebSockets
- Server manages game state (rounds, turns, scores)
- Correct guesses update the score

---

## Deployment Note

Vercel does not support WebSockets.
So the WebSocket server is deployed separately.