import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import PlayerList from '../components/PlayerList.jsx';
import { NotificationContext } from '../context/NotificationContext';
import socket from '../socket.js';
import './Lobby.css';

export default function Lobby({ roomData, setRoomData }) {
  const [gameStarting, setGameStarting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  if (!roomData.roomId) {
    return (
      <div className="lobby-page">
        <div className="lobby-deco-1"></div>
        <div className="lobby-deco-2"></div>
        <div className="lobby-deco-3"></div>
        <div className="lobby-nohome">
          <button className="lobby-btn-primary" onClick={() => navigate('/')}>
            🏠 Go Home
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handlePlayersUpdate = (data) => {
      setRoomData(prev => ({ ...prev, players: data.players }));
    };
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
  const readyCount = roomData.players?.filter(p => p.ready).length || 0;

  return (
    <div className="lobby-page">
      {/* Background decorations */}
      <div className="lobby-deco-1"></div>
      <div className="lobby-deco-2"></div>
      <div className="lobby-deco-3"></div>

      <div className="lobby-wrapper">
        {/* Header */}
        <div className="lobby-header">
          <div className="lobby-top-badge">🎮 MULTIPLAYER DRAWING GAME</div>

          <div className="lobby-logo-row">
            <div className="lobby-logo-icon">🎮</div>
            <h1 className="lobby-logo-text">Skribbl</h1>
          </div>
          <p className="lobby-logo-sub">DRAW • GUESS • WIN</p>

          <button className="lobby-room-code-btn" onClick={handleCopyCode}>
            📋 &nbsp;{roomData.roomId}
          </button>
          <p className="lobby-copy-hint">tap to copy • share with friends</p>

          <p className="lobby-ready-count">
            Players Ready: <span className="lobby-ready-green">{readyCount}</span>
            <span className="lobby-ready-total"> / {roomData.players?.length || 0}</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="lobby-grid">
          {/* Players Card */}
          <div className="lobby-card">
            <div className="lobby-card-head">👥 PLAYERS ({roomData.players?.length || 0})</div>
            <PlayerList
              players={roomData.players || []}
              playerId={roomData.playerId}
              onReady={handleReady}
              isHost={isHost}
              gameStarted={gameStarting}
            />
          </div>

          {/* Settings Card */}
          <div className="lobby-card">
            <div className="lobby-card-head">⚙️ GAME SETTINGS</div>
            <div className="lobby-settings">
              <div className="lobby-setting-row">
                <span className="lobby-setting-label">🔁 Rounds</span>
                <span className="lobby-setting-val lobby-val-orange">{roomData.settings?.rounds || 3}</span>
              </div>
              <div className="lobby-setting-row">
                <span className="lobby-setting-label">⏱️ Draw Time</span>
                <span className="lobby-setting-val lobby-val-pink">{roomData.settings?.drawTime || 60}s</span>
              </div>
              <div className="lobby-setting-row">
                <span className="lobby-setting-label">👥 Max Players</span>
                <span className="lobby-setting-val lobby-val-purple">{roomData.settings?.maxPlayers || 12}</span>
              </div>
              <div className="lobby-setting-row">
                <span className="lobby-setting-label">💡 Hints</span>
                <span className="lobby-setting-val lobby-val-blue">{roomData.settings?.hints || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="lobby-footer">
          {!isReady && !gameStarting && (
            <button className="lobby-btn-primary" onClick={handleReady}>
              ✅ &nbsp;Mark Me Ready
            </button>
          )}
          {isReady && !gameStarting && (
            <div className="lobby-waiting-badge">
              ✅ You're ready! Waiting for others...
            </div>
          )}
          {gameStarting && (
            <div className="lobby-starting-badge">
              🚀 Game is starting...
            </div>
          )}
          <button className="lobby-btn-secondary" onClick={() => navigate('/')}>
            🏠 &nbsp;Home
          </button>
        </div>
      </div>
    </div>
  );
}
