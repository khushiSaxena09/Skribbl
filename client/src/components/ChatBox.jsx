import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

const ChatBox = ({ messages, onSendMessage, isDrawer, players }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="glass-light rounded-lg border border-slate-200 shadow-lg p-3 flex flex-col h-96">
      <h3 className="text-sm font-black text-slate-900 mb-2">
        {isDrawer ? '💬 Chat' : '🎯 Make a Guess'}
      </h3>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1 mb-2 p-2 bg-slate-50 rounded-lg">
        {messages.length === 0 ? (
          <p className="text-xs text-slate-400 text-center mt-2">
            {isDrawer ? 'Chat with players…' : 'Be the first to guess!'}
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="text-[0.7rem] sm:text-xs">
              <span className="font-semibold text-sky-600">
                {msg.playerName?.slice(0, 8)}:
              </span>
              <span className="text-slate-700"> {msg.text}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={isDrawer ? 'Type a message…' : 'Type your guess…'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
        />
        <Button
          onClick={handleSend}
          variant="success"
          size="sm"
          disabled={!input.trim()}
          icon={isDrawer ? '📤' : '🎯'}
        />
      </div>
    </div>
  );
};

export default ChatBox;