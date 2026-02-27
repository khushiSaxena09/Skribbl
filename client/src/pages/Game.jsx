import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawingCanvas from '../components/DrawingCanvas.jsx';
import ChatBox from '../components/ChatBox.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Button from '../components/Button.jsx';
import { NotificationContext } from '../context/NotificationContext';
import socket from '../socket.js';

export default function Game({ roomData, setScreen }) {
  const [drawerId, setDrawerId] = useState('');
  const [wordOptions, setWordOptions] = useState([]);
  const [players, setPlayers] = useState(roomData.players || []);
  const [chatMessages, setChatMessages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [wordLength, setWordLength] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(roomData.settings?.rounds || 3);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [wordChosen, setWordChosen] = useState(false);

  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const isDrawer = drawerId === roomData.playerId;
  const myPlayer = players.find(p => p.id === roomData.playerId);

  useEffect(() => {
    console.log('🎮 GAME COMPONENT MOUNTED - Setting up listeners');

    const onRoundStart = (data) => {
      console.log('=== ROUND START RECEIVED ===', data);

      setDrawerId(data.drawerId);

      const amIDrawer = data.drawerId === roomData.playerId;

      if (amIDrawer && data.words && Array.isArray(data.words) && data.words.length > 0) {
        setWordOptions([...data.words]);
      } else {
        setWordOptions([]);
      }

      setTimeLeft(data.timeLeft || 60);
      setCurrentRound(data.round || 1);
      setTotalRounds(data.totalRounds || 3);
      setWordLength(0);
      setWordChosen(false);
      setChatMessages([]);
      setGameEnded(false);

      if (amIDrawer) {
        addNotification(`✏️ It's your turn to draw! Choose a word!`, 'game', 4000);
      } else {
        const drawerName = players.find(p => p.id === data.drawerId)?.name || 'Someone';
        addNotification(`🎨 ${drawerName} is drawing!`, 'info', 3000);
      }
    };

    const onTimer = ({ timeLeft: t }) => {
      setTimeLeft(t);
      if (t === 10) {
        addNotification('⏰ 10 seconds left!', 'warning');
      }
    };

    const onWordChosen = ({ length, drawerName }) => {
      console.log('📝 Word chosen!', length);
      setWordLength(length);
      setWordChosen(true);
      setWordOptions([]);
      addNotification(`🎯 ${drawerName} chose! ${length} letters!`, 'game');
    };

    const onPlayersUpdate = ({ players: ps }) => {
      setPlayers(ps || []);
    };

    const onChatMessage = ({ playerId, playerName, text, isSystem }) => {
      setChatMessages(prev => [...prev, { playerId, playerName, text, isSystem }]);
    };

    const onCorrectGuess = ({ playerId, playerName, score, word, points }) => {
      setPlayers(prev =>
        prev.map(p => (p.id === playerId ? { ...p, score } : p))
      );
      setChatMessages(prev => [
        ...prev,
        {
          playerId: 'SYSTEM',
          playerName: 'SYSTEM',
          text: `🎉 ${playerName} guessed! +${points}pts`,
          isSystem: true
        }
      ]);

      if (playerId === roomData.playerId) {
        addNotification(`🎯 Correct! +${points}!`, 'score');
      } else {
        addNotification(`${playerName} guessed!`, 'info');
      }
    };

    const onRoundEnd = ({ word, scores, round }) => {
      setPlayers(scores);
      setWordChosen(false);
      setWordOptions([]);
      addNotification(`Round ${round} done! Word: "${word}"`, 'info');
    };

    const onGameOver = ({ winner: winnerName, winnerScore, players: finalPlayers }) => {
      setGameEnded(true);
      setWinner({ name: winnerName, score: winnerScore });
      setPlayers(finalPlayers);

      if (winnerName === myPlayer?.name) {
        addNotification(`🏆 You won!`, 'score');
      } else {
        addNotification(`${winnerName} won!`, 'info');
      }
    };

    socket.on('round_start', onRoundStart);
    socket.on('timer', onTimer);
    socket.on('word_chosen', onWordChosen);
    socket.on('players_update', onPlayersUpdate);
    socket.on('chat_message', onChatMessage);
    socket.on('correct_guess', onCorrectGuess);
    socket.on('round_end', onRoundEnd);
    socket.on('game_over', onGameOver);

    // Let server know we’re ready so it can resend current round state (fixes first round issue)
    if (roomData?.roomId) {
      socket.emit('room_event', {
        roomId: roomData.roomId,
        event: 'game_ready',
        data: {}
      });
    }

    return () => {
      socket.off('round_start', onRoundStart);
      socket.off('timer', onTimer);
      socket.off('word_chosen', onWordChosen);
      socket.off('players_update', onPlayersUpdate);
      socket.off('chat_message', onChatMessage);
      socket.off('correct_guess', onCorrectGuess);
      socket.off('round_end', onRoundEnd);
      socket.off('game_over', onGameOver);
    };
  }, []); // run once

  const chooseWord = (word) => {
    console.log('📝 Choosing word:', word);
    socket.emit('room_event', {
      roomId: roomData.roomId,
      event: 'word_chosen',
      data: { word }
    });
  };

  const handleSendMessage = (text) => {
    socket.emit('room_event', {
      roomId: roomData.roomId,
      event: isDrawer ? 'chat' : 'guess',
      data: { text }
    });
  };

  const handleClear = () => {
    // DrawingCanvas handles clear via socket events
  };

  if (gameEnded) {
    return (
      <div className="min-h-screen Skribbl-bg flex items-center justify-center p-6 relative overflow-hidden">
        <div className="Skribbl-bg-layer">
          <div className="Skribbl-doodle large Skribbl-doodle-1"></div>
          <div className="Skribbl-doodle medium orange Skribbl-doodle-2"></div>
          <div className="Skribbl-doodle small pink Skribbl-doodle-3"></div>
        </div>

        <div className="relative z-10 max-w-2xl w-full glass-light-soft rounded-2xl shadow-2xl p-10 text-center border border-slate-200">
          <div className="text-6xl mb-5 animate-bounce">🏆</div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Game Over!</h1>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-xl p-5 mb-7 text-2xl font-extrabold border border-yellow-300 shadow">
            🥇 {winner?.name}
          </div>

          <p className="text-slate-700 text-base mb-7">
            Final Score{' '}
            <span className="text-3xl font-black text-yellow-500">{winner?.score}</span>
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center justify-center gap-2">
              <span>📊 Final Leaderboard</span>
            </h3>
            <div className="space-y-2">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex justify-between items-center p-4 rounded-lg border ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
                        : index === 1
                        ? 'bg-slate-100 border-slate-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="font-semibold text-slate-900">{player.name}</span>
                    </div>
                    <span className="text-lg font-extrabold text-yellow-500">{player.score}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex gap-4 flex-col">
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              fullWidth
              icon="🔄"
              className="py-3 text-base font-bold h-14"
            >
              Play Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              fullWidth
              icon="🏠"
              className="py-3 text-base font-bold h-14"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen Skribbl-bg p-3 relative overflow-hidden">
      <div className="Skribbl-bg-layer">
        <div className="Skribbl-doodle large Skribbl-doodle-1"></div>
        <div className="Skribbl-doodle medium orange Skribbl-doodle-2"></div>
        <div className="Skribbl-doodle small pink Skribbl-doodle-3"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-[0.65rem] font-bold text-slate-500 mb-1 tracking-wide uppercase">🔄 Round</p>
            <p className="text-2xl font-black text-sky-600">
              {currentRound}/{totalRounds}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-[0.65rem] font-bold text-slate-500 mb-1 tracking-wide uppercase">✏️ Drawer</p>
            <p className="text-sm font-black text-slate-800 truncate">
              {isDrawer ? '👤 You' : players.find(p => p.id === drawerId)?.name || '...'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-[0.65rem] font-bold text-slate-500 mb-1 tracking-wide uppercase">⏱️ Time</p>
            <p
              className={`text-2xl font-black ${
                timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-500'
              }`}
            >
              {timeLeft}s
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-[0.65rem] font-bold text-slate-500 mb-1 tracking-wide uppercase">🔤 Word</p>
            <p className="text-2xl font-black text-sky-600">{wordLength || '?'}</p>
          </div>
        </div>

        {/* Main Game */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Canvas Area */}
          <div className="lg:col-span-3 space-y-3">
            {/* Word Selection */}
            {wordOptions.length > 0 && isDrawer && (
              <div className="bg-gradient-to-r from-yellow-600/80 to-orange-600/80 backdrop-blur-xl rounded-2xl p-5 border-2 border-yellow-500/50 shadow-xl">
                <h3 className="text-base font-black text-white mb-3 text-center">⚡ Choose a Word:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {wordOptions.map((word, i) => (
                    <Button
                      key={i}
                      onClick={() => chooseWord(word)}
                      variant="primary"
                      size="sm"
                      className="font-bold uppercase"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Waiting */}
            {!wordChosen && !isDrawer && (
              <div className="bg-indigo-900/40 border-2 border-indigo-700/50 rounded-xl p-5 text-center shadow-lg">
                <p className="text-base font-bold text-indigo-300">⏳ Waiting for drawer to choose...</p>
              </div>
            )}

            {/* Canvas */}
            <DrawingCanvas
              isDrawer={isDrawer && wordChosen}
              color={color}
              brushSize={brushSize}
              onColorChange={(e) => setColor(e.target.value)}
              onBrushSizeChange={(e) => setBrushSize(parseInt(e.target.value))}
              wordLength={wordLength}
              timeLeft={timeLeft}
              totalTime={60}
              roomId={roomData.roomId}
              socket={socket}
              onClear={handleClear}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <PlayerList players={players} playerId={roomData.playerId} gameStarted={true} />
            <ChatBox
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isDrawer={isDrawer}
              players={players}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
