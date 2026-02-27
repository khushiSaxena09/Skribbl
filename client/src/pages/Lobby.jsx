import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import PlayerList from '../components/PlayerList.jsx';
import { NotificationContext } from '../context/NotificationContext';
import socket from '../socket.js';

export default function Lobby({ roomData, setRoomData }) {
  const [gameStarting, setGameStarting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  if (!roomData.roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center Skribbl-bg relative overflow-hidden">
        <div className="Skribbl-bg-layer">
          <div className="Skribbl-doodle medium Skribbl-doodle-1"></div>
          <div className="Skribbl-doodle small orange Skribbl-doodle-2"></div>
        </div>
        <div className="relative z-10">
          <Button variant="primary" onClick={() => navigate('/')} icon="🏠" className="px-6 py-3 text-sm font-bold">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handlePlayersUpdate = (data) => {
      setRoomData(prev => ({ ...prev, players: data.players }));
    };

    // Listen for a dedicated "game_start" event instead of consuming "round_start"
    const handleGameStart = () => {
      setGameStarting(true);
      setTimeout(() => navigate('/game'), 1000);
    };

    socket.on('players_update', handlePlayersUpdate);
    socket.on('game_start', handleGameStart);

    return () => {
      socket.off('players_update', handlePlayersUpdate);
      socket.off('game_start', handleGameStart);
    };
  }, [setRoomData, navigate]);

  const handleReady = () => {
    socket.emit('room_event', {
      roomId: roomData.roomId,
      event: 'player_ready',
      data: {}
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomData.roomId);
    addNotification('Code copied!', 'success', 2000);
  };

  const isHost = roomData.players?.[0]?.id === roomData.playerId;
  const isReady = roomData.players?.find(p => p.id === roomData.playerId)?.ready || false;
  const allReady = roomData.players?.every(p => p.ready);
  const readyCount = roomData.players?.filter(p => p.ready).length || 0;

  return (
    <div className="min-h-screen Skribbl-bg p-6 relative overflow-hidden">
      <div className="Skribbl-bg-layer">
        <div className="Skribbl-doodle large Skribbl-doodle-1"></div>
        <div className="Skribbl-doodle medium orange Skribbl-doodle-2"></div>
        <div className="Skribbl-doodle small pink Skribbl-doodle-3"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">🎮 Game Lobby</h1>
          
          <button
            onClick={handleCopyCode}
            className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold rounded-xl hover:shadow-xl transition-all text-base mb-2 hover:scale-105 active:scale-95 border border-sky-300"
          >
            📋 {roomData.roomId}
          </button>
          
          <p className="text-slate-600 text-sm font-medium">
            Players Ready: {readyCount}/{roomData.players?.length}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Players List (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <PlayerList
              players={roomData.players || []}
              playerId={roomData.playerId}
              onReady={handleReady}
              isHost={isHost}
              gameStarted={gameStarting}
            />
          </div>

          {/* Right: Settings & Status */}
          <div className="space-y-6">
            {/* Game Settings Card */}
            <div className="glass-light rounded-xl p-6 shadow-lg">
              <h3 className="text-base font-black text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span>⚙️ Game Settings</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">🔄 Rounds</span>
                  <span className="text-lg font-black text-sky-600">{roomData.settings?.rounds || 3}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">⏱️ Draw Time</span>
                  <span className="text-lg font-black text-sky-600">{roomData.settings?.drawTime || 60}s</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">👥 Max Players</span>
                  <span className="text-lg font-black text-sky-600">{roomData.settings?.maxPlayers || 12}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">💡 Hints</span>
                  <span className="text-lg font-black text-sky-600">{roomData.settings?.hints || 0}</span>
                </div>
              </div>
            </div>

            {/* Status Card */}
         
            {/* Info Card */}
          
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex gap-4 justify-center">
          {!isReady && !gameStarting && (
            <Button variant="success" onClick={handleReady} icon="✅" className="px-8 py-3 text-base">
              Mark Me Ready
            </Button>
          )}
          {isReady && !gameStarting && (
            <div className="px-8 py-3 bg-emerald-900/40 border border-emerald-700/50 rounded-lg text-emerald-300 font-bold text-sm">
              ✅ You're ready! Waiting for others...
            </div>
          )}
          <Button variant="outline" onClick={() => navigate('/')} icon="🏠" className="px-8 py-3 text-base">
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}