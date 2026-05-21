/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../socket";
import RoomSettings from "../components/RoomSettings";

function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [publicRooms, setPublicRooms] = useState([]);
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    maxPlayers: 8,
    rounds: 3,
    drawTime: 60,
    wordChoices: 3,
    hints: 2,
    wordMode: "normal",
  });

  useEffect(() => {
    socket.on("room_created", (room) => {
      navigate("/lobby", {
        state: room,
      });
    });

    socket.on("player_joined", (room) => {
      navigate("/lobby", {
        state: room,
      });
    });

    socket.on("error_message", (msg) => {
      toast.error(msg);
    });

    // FETCH PUBLIC ROOMS
    socket.emit("get_public_rooms");

    socket.on("public_rooms", (rooms) => {
      setPublicRooms(rooms);
    });

    socket.on("rooms_updated", () => {
      socket.emit("get_public_rooms");
    });

    return () => {
      socket.off("room_created");
      socket.off("player_joined");
      socket.off("error_message");
      socket.off("public_rooms");
      socket.off("rooms_updated");
    };
  }, []);

  const createRoom = () => {
    if (!playerName) {
      return toast.error("Enter your name");
    }

    // SETTINGS VALIDATION
    if (
      !settings.maxPlayers ||
      !settings.rounds ||
      !settings.drawTime ||
      !settings.wordChoices ||
      settings.hints === undefined ||
      !settings.wordMode
    ) {
      return toast.error("Please select all room settings");
    }

    toast.success(
      `${playerName} created a ${
        isPublic ? "Public 🌍" : "Private 🔒"
      } room successfully 🎉`,
    );

    socket.emit("create_room", {
      playerName,
      settings,
      isPublic,
    });
  };

  const joinRoom = () => {
    if (!playerName || !roomId) {
      return toast.error("Enter your Name and Room ID");
    }

    toast.success(`${playerName} joined a Private 🔒 room successfully 🎉`);
    socket.emit("join_room", {
      roomId,
      playerName,
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-6">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-pink-500 rounded-full blur-[140px] opacity-30"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[140px] opacity-30"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          {/* TITLE */}
          <div className="mb-10">
            <div className="text-7xl mb-5">🎨</div>

            <h1 className="text-6xl font-black text-white leading-tight">
              Skribbl
              <br />
              Clone
            </h1>

            <p className="text-gray-300 mt-5 text-lg leading-relaxed">
              Draw with friends, guess the word, score points and enjoy realtime
              multiplayer fun.
            </p>
          </div>

          {/* NAME */}
          <div className="mb-6">
            <label className="text-white font-semibold block mb-3">
              Your Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* ROOM TYPE */}
          <div className="mb-8">
            <label className="text-white font-semibold block mb-3">
              Room Type
            </label>

            <div className="flex gap-4">
              <button
                onClick={() => setIsPublic(true)}
                className={`flex-1 py-4 rounded-2xl font-bold transition duration-300
                  ${
                    isPublic
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300"
                  }
          `}
              >
                🌍 Public
              </button>

              <button
                onClick={() => setIsPublic(false)}
                className={`flex-1 py-4 rounded-2xl font-bold transition duration-300
                  ${
                    !isPublic
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300"
                  }
                `}
              >
                🔒 Private
              </button>
            </div>
          </div>

          {/* CREATE ROOM */}
          <button
            onClick={createRoom}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-3xl text-xl shadow-[0_10px_40px_rgba(236,72,153,0.4)] hover:scale-[1.02] transition duration-300 mb-8"
          >
            🚀 Create Room
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-white/20"></div>

            <span className="text-gray-300 text-sm">OR JOIN PRIVATE ROOM</span>

            <div className="flex-1 h-[1px] bg-white/20"></div>
          </div>

          {/* ROOM ID */}
          <div className="mb-5">
            <label className="text-white font-semibold block mb-3">
              Room ID
            </label>

            <input
              type="text"
              placeholder="Enter room id"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* JOIN BUTTON */}
          <button
            onClick={joinRoom}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-3xl text-xl shadow-[0_10px_40px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition duration-300"
          >
            🎮 Join Private Room
          </button>
        </div>

        {/* RIGHT SIDE - PUBLIC ROOMS */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white">
                🌍 Public Rooms
              </h2>

              <p className="text-gray-300 mt-2">
                Join active multiplayer rooms
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl text-white font-bold">
              {publicRooms.length} Active
            </div>
          </div>

          {/* ROOMS LIST */}
          <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2">
            {publicRooms.length === 0 && (
              <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center">
                <div className="text-7xl mb-5">😴</div>
                <h3 className="text-3xl font-bold text-white">
                  No Public Rooms
                </h3>
                <p className="text-gray-300 mt-3">
                  Create one and invite players!
                </p>
              </div>
            )}

            {publicRooms.map((room) => (
              <div
                key={room.roomId}
                className="bg-white/10 border border-white/10 rounded-3xl p-6 hover:scale-[1.02] hover:bg-white/15 transition duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  {/* LEFT */}
                  <div className="flex gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-3xl shadow-lg">
                      🎮
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Room #{room.roomId}
                      </h3>

                      <p className="text-gray-300 mt-1">👤 Host: {room.host}</p>

                      <div className="flex gap-3 mt-4">
                        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-xl text-sm font-semibold">
                          🌍 Public
                        </div>

                        <div className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-xl text-sm font-semibold">
                          👥 {room.players} Players
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JOIN BUTTON */}
                  <button
                    onClick={() => {
                      if (!playerName) {
                        return toast.error("Enter your name first");
                      }
                      toast.success(
                        `${playerName} joined a Public 🌍 room successfully 🎉`,
                      );

                      socket.emit("join_room", {
                        roomId: room.roomId,

                        playerName,
                      });
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 text-white font-bold px-7 py-4 rounded-2xl shadow-xl transition duration-300"
                  >
                    Join 🚀
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROOM SETTINGS */}
        <div className="lg:col-span-2">
          <RoomSettings settings={settings} setSettings={setSettings} />
        </div>
      </div>
    </div>
  );
}

export default Home;
