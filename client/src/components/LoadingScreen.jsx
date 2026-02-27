import React from 'react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fdfaf5',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Doodle background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(148,163,184,0.25) 1px, transparent 0),' +
            'radial-gradient(circle at 12px 12px, rgba(96,165,250,0.18) 1.5px, transparent 0),' +
            'radial-gradient(circle at 18px 6px, rgba(251,191,36,0.16) 1.5px, transparent 0),' +
            'linear-gradient(120deg, rgba(96,165,250,0.12) 0, transparent 32%, rgba(244,114,182,0.09) 64%, transparent 100%)',
          backgroundSize: '20px 20px, 32px 32px, 40px 40px, 140px 140px',
          opacity: 1
        }}
      ></div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            borderRadius: '999px',
            border: '3px dashed rgba(96,165,250,0.4)',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 18px 45px -22px rgba(15,23,42,0.55)',
            width: i === 0 ? '18rem' : i === 1 ? '13rem' : '9rem',
            height: i === 0 ? '11rem' : i === 1 ? '9rem' : '9rem',
            top: i === 0 ? '-3rem' : i === 1 ? '60%' : '10%',
            left: i === 0 ? '-3rem' : i === 1 ? '8%' : '72%',
            transform: i === 0 ? 'rotate(-8deg)' : i === 1 ? 'rotate(6deg)' : 'rotate(-4deg)',
            animation: `float 11s ease-in-out infinite`,
            animationDelay: `${i * 2}s`
          }}
        ></div>
      ))}

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '2.5rem 3rem',
          borderRadius: '1.75rem',
          background: 'rgba(255,255,255,0.96)',
          boxShadow: '0 30px 60px -24px rgba(15,23,42,0.4)',
          border: '2px solid rgba(148,163,184,0.4)',
          maxWidth: '28rem',
          width: '100%'
        }}
      >
        {/* Icon + loader */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '1.25rem',
              border: '3px dashed rgba(96,165,250,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, rgba(219,234,254,0.9), rgba(254,249,195,0.9))'
            }}
          >
            <span style={{ fontSize: '1.9rem' }}>🖊️</span>
          </div>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '999px',
              border: '4px solid rgba(129,140,248,0.45)',
              borderTopColor: '#f97316',
              animation: 'spin 0.8s linear infinite',
              background: 'white'
            }}
          ></div>
        </div>

        {/* Text */}
        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#0f172a',
            marginBottom: '0.4rem',
            letterSpacing: '-0.03em'
          }}
        >
          {message}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
          Sharpening pencils and setting up your Skribbl room…
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5rem); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(1.5rem, 1.5rem); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;