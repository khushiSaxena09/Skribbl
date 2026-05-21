/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../socket";

function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState(location.state);

  useEffect(() => {
    socket.on("player_joined", (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on("player_left", ({ players }) => {
      setRoom((prev) => ({
        ...prev,

        players,
      }));
    });

    socket.on("game_started", () => {
      navigate("/game", {
        state: room,
      });
    });

    return () => {
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("game_started");
    };
  }, [room]);

  const startGame = () => {
    toast.success(
      `${
        room.players.find((p) => p.id === room.host)?.name
      } started the game 🚀`,
    );

    socket.emit("start_game", {
      roomId: room.roomId,
    });
  };

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(room.roomId);
    toast.success("Room ID Copied Successfully 📋");
  };

  const isHost = room.host === socket.id;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-pink-500 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[120px] opacity-30"></div>
      {/* MAIN CARD */}
      <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-pink-500/30 to-cyan-500/30 border-b border-white/10 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white">🎮 Game Lobby</h1>
              <p className="text-gray-300 mt-3 text-lg">
                Waiting for players to join...
              </p>
            </div>
            {/* ROOM ID CARD */}
            <div className="bg-white/10 border border-white/20 rounded-3xl px-6 py-4 backdrop-blur-xl">
              <p className="text-gray-300 text-sm mb-1">Room ID</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-white tracking-wider">
                  {room.roomId}
                </h2>
                <button
                  onClick={copyRoomId}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYERS */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">👥 Players</h2>
            <div className="bg-white/10 border border-white/20 px-5 py-2 rounded-2xl text-white font-semibold">
              {room.players.length} Players
            </div>
          </div>
          {/* PLAYERS GRID */}
          <div className="grid sm:grid-cols-2 gap-5">
            {room.players.map((player, index) => (
              <div
                key={player.id}
                className="bg-white/10 border border-white/20 rounded-3xl p-5 flex items-center justify-between hover:scale-[1.02] transition duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* AVATAR */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {player.name}
                    </h3>
                    <p className="text-gray-300 text-sm">Player #{index + 1}</p>
                  </div>
                </div>

                {/* HOST BADGE */}
                {room.host === player.id && (
                  <div className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-2xl shadow-lg">
                    👑 Host
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* START BUTTON */}
          <div className="mt-10 flex justify-center">
            {isHost ? (
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 text-white text-xl font-bold px-12 py-5 rounded-3xl shadow-[0_10px_40px_rgba(16,185,129,0.5)] transition duration-300"
              >
                🚀 Start Game
              </button>
            ) : (
              <div className="bg-white/10 border border-white/20 text-gray-300 px-8 py-4 rounded-2xl text-lg">
                ⏳ Waiting for host to start the game...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
