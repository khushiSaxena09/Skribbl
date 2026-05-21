import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";
import GameCanvas from "../components/GameCanvas";
import ChatBox from "../components/ChatBox";
import toast from "react-hot-toast";

function Game() {
  const location = useLocation();
  const [room, setRoom] = useState(location.state);
  const [gameState, setGameState] = useState(null);
  const [players, setPlayers] = useState(room.players);
  const [timeLeft, setTimeLeft] = useState(room.settings.drawTime || 60);
  const [hint, setHint] = useState("");

  useEffect(() => {
    socket.on("game_state", (state) => {
      setGameState(state);

      // UPDATE ROOM
      setRoom((prev) => ({
        ...prev,
        currentRound: state.currentRound,
        totalRounds: state.totalRounds,
      }));

      // RESET TIMER EVERY ROUND
      setTimeLeft(Number(state.drawTime));
    });

    socket.on("correct_guess", ({ players }) => {
      setPlayers(players);
    });

    socket.on("round_end", ({ word }) => {
      setHint("");
      toast.success(`$⏰ Round Over!\n\nThe word was: ${word}`);
    });

    socket.on("timer_update", ({ timeLeft }) => {
      setTimeLeft(Number(timeLeft));
    });

    socket.on("hint", ({ hint }) => {
      setHint(hint);
    });

    socket.on("game_over", ({ players }) => {
      const winner = [...players].sort((a, b) => b.score - a.score)[0];
      toast.success(
        `🏆 Game Over!\n\nWinner: ${winner.name}\nScore: ${winner.score}`,
        {
          duration: 6000,
        },
      );
    });

    return () => {
      socket.off("game_state");
      socket.off("correct_guess");
      socket.off("round_end");
      socket.off("game_over");
      socket.off("timer_update");
      socket.off("hint");
      socket.off("choose_word");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-pink-500 rounded-full blur-[140px] opacity-30"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[140px] opacity-30"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 p-6">
        {/* LEFT SIDE */}
        <div className="flex-1">
          {/* TOP HEADER */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[30px] p-6 shadow-2xl mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* GAME INFO */}
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  🎨 Skribbl Game
                </h1>
                <p className="text-gray-300 mt-2">Multiplayer Drawing Battle</p>
              </div>

              {/* STATUS CARDS */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 min-w-[130px]">
                  <p className="text-gray-400 text-sm">Round</p>
                  <h2 className="text-2xl font-bold">
                    {gameState
                      ? `${gameState.currentRound}/${gameState.totalRounds}`
                      : `${room.currentRound}/${room.totalRounds}`}
                  </h2>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 min-w-[130px]">
                  <p className="text-gray-400 text-sm">Timer</p>
                  <h2 className="text-2xl font-bold text-yellow-300">
                    ⏳ {timeLeft}s
                  </h2>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 min-w-[160px]">
                  <p className="text-gray-400 text-sm">Drawer</p>
                  <h2 className="text-xl font-bold text-pink-300">
                    ✏️{" "}
                    {gameState?.drawer
                      ? gameState.drawer
                      : room.players.find((p) => p.id === room.host)?.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* CANVAS CARD */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[35px] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            <GameCanvas roomId={room.roomId} room={room} hint={hint} />
          </div>
        </div>

        {/* RIGHT SIDE CHAT */}
        <div className="w-full lg:w-[380px]">
          <ChatBox roomId={room.roomId} players={players} />
        </div>
      </div>
    </div>
  );
}

export default Game;
