import { useEffect, useRef, useState } from "react";

import { socket } from "../socket";

function ChatBox({ roomId, players }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "chat",
          ...data,
        },
      ]);
    });

    socket.on("correct_guess", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "correct",
          ...data,
        },
      ]);
    });

    return () => {
      socket.off("chat_message");
      socket.off("correct_guess");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      roomId,
      message,
    });

    setMessage("");
  };

  return (
    <div className="w-[340px] h-[700px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <h2 className="text-2xl font-bold">💬 Game Chat</h2>

        <p className="text-sm text-blue-100">Guess the drawing!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === "chat" && (
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm">
                  <span className="font-bold text-blue-600">
                    {msg.playerName}
                  </span>

                  <span className="text-gray-700"> : {msg.message}</span>
                </p>
              </div>
            )}

            {msg.type === "correct" && (
              <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-xl text-sm font-semibold">
                🎉 {msg.playerName} guessed correctly!
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your guess..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 text-sm text-black
            "
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 rounded-xl font-semibold transition duration-200"
          >
            Send
          </button>
        </div>
      </div>

      <div className="border-t bg-gray-100 p-4">
        <h3 className="text-lg font-bold mb-3 text-gray-700">🏆 Leaderboard</h3>

        <div className="space-y-2">
          {[...players]
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-white px-4 py-2 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : "🎮"}
                  </span>

                  <span className="font-medium text-gray-700">
                    {player.name}
                  </span>
                </div>
                <span className="font-bold text-blue-600">{player.score}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default ChatBox;
