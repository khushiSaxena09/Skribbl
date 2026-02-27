import React from 'react';

const Timer = ({ timeLeft, totalTime = 60 }) => {
  const percentage = (timeLeft / totalTime) * 100;
  
  let color = '#10b981'; // Green
  if (percentage <= 25) color = '#ef4444'; // Red
  else if (percentage <= 50) color = '#f59e0b'; // Orange

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      {/* Circular Progress */}
      <div
        style={{
          position: 'relative',
          width: '8rem',
          height: '8rem',
          borderRadius: '50%',
          background: `conic-gradient(${color} 0deg ${(percentage / 100) * 360}deg, rgba(255,255,255,0.1) ${(percentage / 100) * 360}deg 360deg)`,
          boxShadow: `0 0 30px ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: percentage <= 10 ? 'pulse 0.5s infinite' : 'none'
        }}
      >
        <div
          style={{
            width: '7rem',
            height: '7rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ fontSize: '2.5rem', fontWeight: 'black', color: color }}>
            {timeLeft}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
            seconds
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px ${color}; }
          50% { box-shadow: 0 0 60px ${color}, 0 0 100px ${color}; }
        }
      `}</style>
    </div>
  );
};

export default Timer;