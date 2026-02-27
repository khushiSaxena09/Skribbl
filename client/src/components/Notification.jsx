import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const Notification = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  const typeStyles = {
    success: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: '✅',
      border: '#059669'
    },
    error: {
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: '❌',
      border: '#dc2626'
    },
    warning: {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: '⚠️',
      border: '#d97706'
    },
    info: {
      bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      icon: 'ℹ️',
      border: '#1d4ed8'
    },
    game: {
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      icon: '🎮',
      border: '#6d28d9'
    },
    score: {
      bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      icon: '⭐',
      border: '#be185d'
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '24rem',
        pointerEvents: 'auto'
      }}
    >
      {notifications.map((notification, index) => {
        const style = typeStyles[notification.type] || typeStyles.info;
        
        return (
          <div
            key={notification.id}
            style={{
              background: style.bg,
              color: 'white',
              padding: '1.25rem',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              border: `2px solid ${style.border}`,
              backdropFilter: 'blur(10px)',
              animation: 'slideInRight 0.4s ease-out',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => removeNotification(notification.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
              {style.icon}
            </span>
            <div style={{ flex: 1, wordBreak: 'break-word' }}>
              <p style={{ margin: 0, fontWeight: '600', lineHeight: '1.5' }}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ✕
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;