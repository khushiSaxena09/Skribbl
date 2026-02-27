import React from 'react';
import Button from './Button.jsx';

const PlayerList = ({ players = [], playerId = '', onReady, isHost = false, gameStarted = false }) => {
  const myPlayer = players.find(p => p.id === playerId);
  const isReady = myPlayer?.ready || false;

  return (
    <div className="glass-light rounded-lg shadow-lg p-4 border border-slate-200">
      <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1">
        <span>👥 Players</span>
        <span className="text-xs font-semibold text-slate-500">({players.length})</span>
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg flex items-center justify-between text-xs sm:text-sm transition-all border ${
              player.id === playerId
                ? 'bg-sky-50 border-sky-300'
                : player.ready
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-bold text-slate-400">#{index + 1}</span>
              <div>
                <p className="font-semibold text-slate-900">{player.name}</p>
                {player.ready && <p className="text-[0.7rem] text-emerald-600">✅ Ready</p>}
              </div>
            </div>
            {player.score > 0 && (
              <span className="text-[0.7rem] font-bold text-yellow-500">⭐ {player.score}</span>
            )}
          </div>
        ))}
      </div>

      {!isReady && !gameStarted && onReady && (
        <Button
          variant="success"
          onClick={onReady}
          fullWidth
          size="sm"
          icon="✅"
          className="mt-3"
        >
          Ready
        </Button>
      )}
    </div>
  );
};

export default PlayerList;