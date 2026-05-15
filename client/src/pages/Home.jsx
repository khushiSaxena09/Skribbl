// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../components/Button.jsx';
// import Input from '../components/Input.jsx';
// import { NotificationContext } from '../context/NotificationContext';
// import socket from '../socket.js';

// const Home = ({ setRoomData }) => {
//   const [tab, setTab] = useState('create');
//   const [playerName, setPlayerName] = useState('');
//   const [roomId, setRoomId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { addNotification } = useContext(NotificationContext);

//   const handleCreate = () => {
//     if (!playerName.trim()) {
//       addNotification('Enter your name', 'warning');
//       return;
//     }
//     setLoading(true);
//     socket.emit('create_room', {
//       hostName: playerName.trim(),
//       settings: { rounds: 3, drawTime: 60 }
//     });
//   };

//   const handleJoin = () => {
//     if (!roomId.trim() || !playerName.trim()) {
//       addNotification('Enter room code and name', 'warning');
//       return;
//     }
//     setLoading(true);
//     socket.emit('join_room', {
//       roomId: roomId.trim().toUpperCase(),
//       playerName: playerName.trim()
//     });
//   };

//   useEffect(() => {
//     const handleRoomCreated = (data) => {
//       setRoomData(data);
//       addNotification(`Room ${data.roomId} created!`, 'success');
//       setLoading(false);
//       navigate('/lobby');
//     };

//     const handleJoinedRoom = (data) => {
//       setRoomData(data);
//       addNotification('Joined room!', 'success');
//       setLoading(false);
//       navigate('/lobby');
//     };

//     const handleError = (error) => {
//       addNotification(error.message || 'Error', 'error');
//       setLoading(false);
//     };

//     socket.on('room_created', handleRoomCreated);
//     socket.on('joined_room', handleJoinedRoom);
//     socket.on('error', handleError);

//     return () => {
//       socket.off('room_created');
//       socket.off('joined_room');
//       socket.off('error');
//     };
//   }, [setRoomData, addNotification, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center Skribbl-bg relative overflow-hidden">
//         <div className="Skribbl-bg-layer">
//           <div className="Skribbl-doodle large Skribbl-doodle-1"></div>
//           <div className="Skribbl-doodle medium orange Skribbl-doodle-2"></div>
//           <div className="Skribbl-doodle small pink Skribbl-doodle-3"></div>
//         </div>
//         <div className="relative z-10 text-center">
//           <div className="w-12 h-12 border-4 border-indigo-400/50 border-t-orange-400 rounded-full animate-spin mx-auto mb-4 bg-white shadow-lg"></div>
//           <p className="text-slate-600 text-sm font-medium">Connecting to the drawing room…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center Skribbl-bg p-4 relative overflow-hidden">
//       <div className="Skribbl-bg-layer">
//         <div className="Skribbl-doodle large Skribbl-doodle-1"></div>
//         <div className="Skribbl-doodle medium orange Skribbl-doodle-2"></div>
//         <div className="Skribbl-doodle small pink Skribbl-doodle-3"></div>
//         <div className="Skribbl-doodle small Skribbl-doodle-4"></div>
//       </div>

//       <div className="w-full max-w-sm relative z-10">
//         {/* Enhanced Header */}
//         <div className="text-center mb-10">
//           {/* Icon */}
//           <div className="flex justify-center mb-6">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
//               <div className="relative w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border-4 border-dashed border-sky-300">
//                 <span className="text-5xl">🖍️</span>
//               </div>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-5xl font-black text-slate-800 mb-1 tracking-tight drop-shadow-sm">
//             Skribbl
//           </h1>

//           {/* Subtitle with gradient */}
//           <div className="space-y-1">
//             <p className="text-lg font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-orange-400 bg-clip-text text-transparent">
//               Draw • Guess • Win
//             </p>
//             <p className="text-slate-500 text-sm">Fast, fun multiplayer doodle battles</p>
//           </div>
//         </div>

//         {/* Card */}
//         <div className="glass-light-soft rounded-2xl shadow-2xl p-7 border border-slate-200/70">
//           {/* Tabs */}
//           <div className="flex gap-3 mb-7 bg-slate-100 border border-slate-200 rounded-xl p-2">
//             {['create', 'join'].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTab(t)}
//                 className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
//                   tab === t
//                     ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md'
//                     : 'text-slate-500 hover:text-slate-700'
//                 }`}
//               >
//                 {t === 'create' ? '🎯 Create' : '👥 Join'}
//               </button>
//             ))}
//           </div>

//           {/* Form */}
//           <div className="space-y-4">
//             {tab === 'create' ? (
//               <>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
//                     Your username
//                   </label>
//                   <Input
//                     placeholder="Enter your name"
//                     value={playerName}
//                     onChange={(e) => setPlayerName(e.target.value)}
//                   />
//                 </div>
//                 <Button
//                   onClick={handleCreate}
//                   variant="primary"
//                   fullWidth
//                   icon="🚀"
//                   disabled={!playerName.trim()}
//                   className="py-3 text-base"
//                 >
//                   Create Room
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
//                     Room code
//                   </label>
//                   <Input
//                     placeholder="e.g., ABC123"
//                     value={roomId}
//                     onChange={(e) => setRoomId(e.target.value.toUpperCase())}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
//                     Your username
//                   </label>
//                   <Input
//                     placeholder="Enter your name"
//                     value={playerName}
//                     onChange={(e) => setPlayerName(e.target.value)}
//                   />
//                 </div>
//                 <Button
//                   onClick={handleJoin}
//                   variant="success"
//                   fullWidth
//                   icon="➤"
//                   disabled={!roomId.trim() || !playerName.trim()}
//                   className="py-3 text-base"
//                 >
//                   Join Room
//                 </Button>
//               </>
//             )}
//           </div>

//           {/* Info */}
//           <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
//             <p className="text-xs text-sky-700 text-center font-medium">
//               💡 {tab === 'create' ? 'Create a room and invite friends to play' : 'Ask host for the room code'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { NotificationContext } from '../context/NotificationContext';
import socket from '../socket.js';

const Home = ({ setRoomData }) => {
  const [tab, setTab] = useState('create');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const [settings, setSettings] = useState({
    maxPlayers: 6,
    rounds: 3,
    drawTime: 60
  });

  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  // 🌍 FETCH PUBLIC ROOMS
  useEffect(() => {
    socket.emit('get_public_rooms');

    socket.on('public_rooms', setPublicRooms);

    return () => socket.off('public_rooms');
  }, []);

  // 🧠 ROOM EVENTS
  useEffect(() => {
    socket.on('room_created', (data) => {
      setRoomData(data);
      navigate('/lobby');
    });

    socket.on('joined_room', (data) => {
      setRoomData(data);
      navigate('/lobby');
    });

    socket.on('error', (err) => {
      addNotification(err.message, 'error');
    });

    return () => {
      socket.off('room_created');
      socket.off('joined_room');
      socket.off('error');
    };
  }, []);

  const handleCreate = () => {
    socket.emit('create_room', {
      hostName: playerName,
      settings
    });
  };

  const handleJoin = () => {
    socket.emit('join_room', {
      roomId,
      playerName
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white p-6">

      <h1 className="text-4xl font-bold text-center mb-6">🎮 Skribbl Game</h1>

      {/* TABS */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setTab('create')}>Create</button>
        <button onClick={() => setTab('join')}>Join</button>
      </div>

      {/* CREATE */}
      {tab === 'create' && (
        <div className="max-w-md mx-auto space-y-3">

          <Input placeholder="Your Name" onChange={(e) => setPlayerName(e.target.value)} />

          <div className="bg-gray-800 p-3 rounded">
            <p>Players (2-20)</p>
            <input type="number" min="2" max="20"
              value={settings.maxPlayers}
              onChange={(e) => setSettings({ ...settings, maxPlayers: +e.target.value })}
            />

            <p>Rounds (2-10)</p>
            <input type="number" min="2" max="10"
              value={settings.rounds}
              onChange={(e) => setSettings({ ...settings, rounds: +e.target.value })}
            />

            <p>Draw Time (15-240)</p>
            <input type="number" min="15" max="240"
              value={settings.drawTime}
              onChange={(e) => setSettings({ ...settings, drawTime: +e.target.value })}
            />
          </div>

          <Button onClick={handleCreate}>Create Room</Button>
        </div>
      )}

      {/* JOIN */}
      {tab === 'join' && (
        <div className="max-w-md mx-auto space-y-3">
          <Input placeholder="Room ID" onChange={(e) => setRoomId(e.target.value)} />
          <Input placeholder="Your Name" onChange={(e) => setPlayerName(e.target.value)} />
          <Button onClick={handleJoin}>Join Room</Button>
        </div>
      )}

      {/* 🌍 PUBLIC ROOMS */}
      <div className="mt-10 max-w-md mx-auto">
        <h2 className="text-xl mb-3">🌍 Public Rooms</h2>

        {publicRooms.length === 0 ? (
          <p>No rooms available</p>
        ) : (
          publicRooms.map((room) => (
            <div key={room.roomId} className="bg-gray-800 p-3 mb-2 rounded flex justify-between">
              <div>
                <p>{room.roomId}</p>
                <p className="text-sm">{room.playerCount}/{room.maxPlayers}</p>
              </div>

              <button
                onClick={() => {
                  setRoomId(room.roomId);
                  setTab('join');
                }}
              >
                Join
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;