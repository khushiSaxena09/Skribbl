// import React, { useState, useEffect, useRef } from 'react';
// import Button from './Button';

// const ChatBox = ({ messages, onSendMessage, isDrawer, players }) => {
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = () => {
//     if (input.trim()) {
//       onSendMessage(input);
//       setInput('');
//     }
//   };

//   return (
//     <div
//       style={{
//         background: 'linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
//         backdropFilter: 'blur(30px)',
//         borderRadius: '2rem',
//         padding: '1.5rem',
//         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//         border: '1px solid rgba(255, 255, 255, 0.2)',
//         display: 'flex',
//         flexDirection: 'column',
//         height: '24rem'
//       }}
//     >
//       <h3
//         style={{
//           fontSize: '1.5rem',
//           fontWeight: 'bold',
//           marginBottom: '1rem',
//           color: 'white'
//         }}
//       >
//         {isDrawer ? '💬 Chat' : '🧠 Make a Guess!'}
//       </h3>

//       <div
//         style={{
//           flex: 1,
//           overflowY: 'auto',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '0.5rem',
//           padding: '1rem',
//           background: 'rgba(255, 255, 255, 0.7)',
//           borderRadius: '1.25rem',
//           marginBottom: '1rem',
//           maxHeight: '16rem'
//         }}
//       >
//         {messages.map((msg, i) => {
//           const player = players.find(p => p.id === msg.playerId);
//           return (
//             <div
//               key={i}
//               style={{
//                 fontSize: '1rem',
//                 display: 'flex',
//                 alignItems: 'flex-start',
//                 gap: '0.75rem'
//               }}
//             >
//               <span
//                 style={{
//                   fontWeight: 'bold',
//                   paddingLeft: '0.5rem',
//                   paddingRight: '0.5rem',
//                   paddingTop: '0.25rem',
//                   paddingBottom: '0.25rem',
//                   borderRadius: '0.375rem',
//                   fontSize: '0.875rem',
//                   background: msg.playerId === 'SYSTEM' ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'linear-gradient(to right, #3b82f6, #1e40af)',
//                   color: 'white'
//                 }}
//               >
//                 {msg.playerId === 'SYSTEM' ? '🎮' : (player?.name?.slice(0, 8) || 'Unknown')}
//               </span>
//               <span style={{ flex: 1, color: '#1f2937', wordBreak: 'break-word' }}>{msg.text}</span>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       <div style={{ display: 'flex', gap: '0.75rem' }}>
//         <input
//           type="text"
//           className="flex-1 px-4 py-4 rounded-3xl border-2 border-white/50 focus:border-blue-400 outline-none bg-white/90 text-lg font-semibold"
//           placeholder={isDrawer ? 'Type message...' : 'Type your guess...'}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//           style={{
//             flex: 1,
//             padding: '1rem',
//             borderRadius: '1.5rem',
//             border: '2px solid rgba(255, 255, 255, 0.5)',
//             outline: 'none',
//             background: 'rgba(255, 255, 255, 0.9)',
//             fontSize: '1.125rem',
//             fontWeight: '600',
//             transition: 'all 0.3s'
//           }}
//         />
//         <Button
//           onClick={handleSend}
//           variant="success"
//           disabled={!input.trim()}
//           className="h-16 px-6"
//         >
//           {isDrawer ? '📤 Send' : '🎯 Guess'}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

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

  // return (
  //   <div
  //     style={{
  //       background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
  //       backdropFilter: 'blur(20px)',
  //       borderRadius: '1.5rem',
  //       padding: '1.5rem',
  //       boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  //       border: '2px solid rgba(255,255,255,0.2)',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       height: '25rem'
  //     }}
  //   >
  //     <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white', margin: 0 }}>
  //       {isDrawer ? '💬 Chat' : '🎯 Make Your Guess!'}
  //     </h3>

  //     <div
  //       style={{
  //         flex: 1,
  //         overflowY: 'auto',
  //         display: 'flex',
  //         flexDirection: 'column',
  //         gap: '0.5rem',
  //         padding: '1rem',
  //         background: 'rgba(255,255,255,0.8)',
  //         borderRadius: '1rem',
  //         marginBottom: '1rem',
  //         maxHeight: '15rem'
  //       }}
  //     >
  //       {messages.length === 0 ? (
  //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
  //           <p style={{ margin: 0 }}>
  //             {isDrawer ? 'Chat with other players...' : 'Be the first to guess!'}
  //           </p>
  //         </div>
  //       ) : (
  //         messages.map((msg, i) => {
  //           const player = players.find(p => p.id === msg.playerId);
  //           return (
  //             <div
  //               key={i}
  //               style={{
  //                 padding: '0.75rem',
  //                 background: msg.isSystem ? 'linear-gradient(135deg, #a855f7, #6d28d9)' : 'white',
  //                 borderRadius: '0.5rem',
  //                 display: 'flex',
  //                 alignItems: 'flex-start',
  //                 gap: '0.5rem',
  //                 border: msg.isSystem ? 'none' : '1px solid #e0e0e0'
  //               }}
  //             >
  //               <span
  //                 style={{
  //                   fontWeight: 'bold',
  //                   paddingLeft: '0.25rem',
  //                   paddingRight: '0.25rem',
  //                   paddingTop: '0.125rem',
  //                   paddingBottom: '0.125rem',
  //                   borderRadius: '0.25rem',
  //                   fontSize: '0.75rem',
  //                   background: msg.isSystem ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #3b82f6, #1e40af)',
  //                   color: 'white',
  //                   minWidth: 'fit-content'
  //                 }}
  //               >
  //                 {msg.isSystem ? '🎮' : (player?.name?.slice(0, 10) || 'Unknown')}
  //               </span>
  //               <span style={{ flex: 1, color: msg.isSystem ? 'white' : '#1f2937', wordBreak: 'break-word', fontSize: '0.95rem' }}>
  //                 {msg.text}
  //               </span>
  //             </div>
  //           );
  //         })
  //       )}
  //       <div ref={messagesEndRef} />
  //     </div>

  //     <div style={{ display: 'flex', gap: '0.75rem' }}>
  //       <input
  //         type="text"
  //         placeholder={isDrawer ? 'Type message...' : 'Type your guess...'}
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}
  //         onKeyPress={(e) => e.key === 'Enter' && handleSend()}
  //         style={{
  //           flex: 1,
  //           padding: '0.75rem',
  //           borderRadius: '1rem',
  //           border: '2px solid rgba(255,255,255,0.5)',
  //           outline: 'none',
  //           background: 'rgba(255,255,255,0.9)',
  //           fontSize: '0.95rem',
  //           fontWeight: '500',
  //           transition: 'all 0.3s',
  //           fontFamily: 'Inter, sans-serif'
  //         }}
  //         onFocus={(e) => {
  //           e.target.style.borderColor = '#3b82f6';
  //           e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
  //         }}
  //         onBlur={(e) => {
  //           e.target.style.borderColor = 'rgba(255,255,255,0.5)';
  //           e.target.style.boxShadow = 'none';
  //         }}
  //       />
  //       <Button
  //         onClick={handleSend}
  //         variant="success"
  //         disabled={!input.trim()}
  //         icon={isDrawer ? '📤' : '🎯'}
  //         size="md"
  //       >
  //         {isDrawer ? 'Send' : 'Guess'}
  //       </Button>
  //     </div>
  //   </div>
  // );

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