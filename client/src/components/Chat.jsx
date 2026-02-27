import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const Chat = ({ messages, onSendMessage, guessMode }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col h-96">
      <h3 className="font-bold text-lg mb-4">
        {guessMode ? '🧠 Guess the word!' : '💬 Chat'}
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-xl mb-4 max-h-64">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-white rounded-lg shadow-sm">
            <span className="font-semibold text-blue-600">{msg.playerName}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={guessMode ? "Type your guess..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;
