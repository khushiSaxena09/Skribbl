// import { useState, useEffect } from 'react';
// import Home from './pages/Home.jsx';
// import Lobby from './pages/Lobby.jsx';
// import Game from './pages/Game.jsx';
// import socket from './socket.js';

// function App() {
//   const [screen, setScreen] = useState('home');
//   const [roomData, setRoomData] = useState({
//     roomId: '',
//     playerId: '',
//     players: [],
//     settings: { rounds: 3, drawTime: 60, maxPlayers: 12, hints: 0 }
//   });
//   const [connectionStatus, setConnectionStatus] = useState('connecting');

//   // Socket connection status
//   useEffect(() => {
//     const handleConnect = () => {
//       console.log('✅ Socket connected:', socket.id);
//       setConnectionStatus('connected');
//     };

//     const handleDisconnect = () => {
//       console.log('❌ Socket disconnected');
//       setConnectionStatus('disconnected');
//     };

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//     };
//   }, []);

//   return (
//     <div style={{ minHeight: '100vh' }}>
//       {/* Connection indicator */}
//       {connectionStatus === 'disconnected' && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '1rem',
//             right: '1rem',
//             background: '#ef4444',
//             color: 'white',
//             padding: '1rem',
//             borderRadius: '0.5rem',
//             zIndex: 9999,
//             fontWeight: 'bold'
//           }}
//         >
//           🔴 Disconnected
//         </div>
//       )}

//       {screen === 'home' && (
//         <Home setScreen={setScreen} setRoomData={setRoomData} />
//       )}
//       {screen === 'lobby' && (
//         <Lobby
//           roomData={roomData}
//           setRoomData={setRoomData}
//           setScreen={setScreen}
//         />
//       )}
//       {screen === 'game' && (
//         <Game roomData={roomData} setScreen={setScreen} />
//       )}
//     </div>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Lobby from './pages/Lobby.jsx';
import Game from './pages/Game.jsx';
import Notification from './components/Notification.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { NotificationProvider } from './context/NotificationContext';
import socket from './socket.js';

function AppContent() {
  const [screen, setScreen] = useState('home');
  const [roomData, setRoomData] = useState({
    roomId: '',
    playerId: '',
    players: [],
    settings: { rounds: 3, drawTime: 60, maxPlayers: 12, hints: 0 }
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const handleConnect = () => {
      console.log('✅ Socket connected:', socket.id);
      setConnectionStatus('connected');
    };

    const handleDisconnect = () => {
      console.log('❌ Socket disconnected');
      setConnectionStatus('disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  if (connectionStatus === 'connecting') {
    return <LoadingScreen message="Connecting to game server..." />;
  }

  return (
    <>
      <Notification />
      
      {connectionStatus === 'disconnected' && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            background: '#ef4444',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.75rem',
            zIndex: 9999,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }}
        >
          🔴 Connection Lost
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<Home setRoomData={setRoomData} />}
        />
        <Route
          path="/lobby"
          element={
            roomData.roomId ? (
              <Lobby roomData={roomData} setRoomData={setRoomData} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/game"
          element={
            roomData.roomId ? (
              <Game roomData={roomData} setScreen={setScreen} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}