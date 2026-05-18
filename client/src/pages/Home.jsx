import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { NotificationContext } from '../context/NotificationContext';
import socket from '../socket.js';

/* ── inline styles (no extra files needed) ── */
const S = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0f0c29 0%,#1a0533 45%,#0d1b4b 100%)',
    fontFamily: "'Nunito',sans-serif",
    padding: '36px 16px 60px',
    position: 'relative',
    overflowX: 'hidden',
  },
  blob: (top, left, right, bottom, color, size) => ({
    position: 'fixed', borderRadius: '50%',
    width: size, height: size, background: color,
    top, left, right, bottom,
    filter: 'blur(80px)', opacity: 0.18, pointerEvents: 'none', zIndex: 0,
  }),
  doodle: (top, left, right, bottom, fs) => ({
    position: 'fixed', fontSize: fs || '2rem',
    top, left, right, bottom,
    opacity: 0.1, pointerEvents: 'none', userSelect: 'none', zIndex: 0,
  }),
  header: { textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 },
  badgePill: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: 'rgba(255,230,0,0.12)', border: '1px solid rgba(255,230,0,0.28)',
    color: '#ffe600', fontSize: '0.68rem', fontWeight: 800,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    padding: '4px 14px', borderRadius: 100, marginBottom: 14,
  },
  logoWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 4 },
  logoIcon: {
    width: 62, height: 62,
    background: 'linear-gradient(135deg,#ff2d78,#ff8c00)',
    borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', boxShadow: '0 0 32px #ff2d7877',
  },
  logoTitle: {
    fontFamily: "'Fredoka One',cursive", fontSize: '3.4rem', letterSpacing: 2,
    background: 'linear-gradient(90deg,#ff2d78,#ffe600,#00e5ff,#b44fff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', lineHeight: 1,
  },
  tagline: {
    color: 'rgba(255,255,255,0.38)', fontSize: '0.8rem',
    fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginTop: 6,
  },
  card: {
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
    border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: 26,
    padding: '28px 24px', maxWidth: 460, margin: '0 auto 28px',
    position: 'relative', zIndex: 1, boxShadow: '0 8px 60px rgba(0,0,0,0.55)',
  },
  tabs: {
    display: 'flex', gap: 8,
    background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: 5, marginBottom: 24,
  },
  tabActive: {
    flex: 1, padding: '11px 0', border: 'none', borderRadius: 11, cursor: 'pointer',
    fontFamily: "'Nunito',sans-serif", fontSize: '0.88rem', fontWeight: 800,
    background: 'linear-gradient(135deg,#ff2d78,#b44fff)',
    color: '#fff', boxShadow: '0 4px 18px #ff2d7855',
  },
  tabInactive: {
    flex: 1, padding: '11px 0', border: 'none', borderRadius: 11, cursor: 'pointer',
    fontFamily: "'Nunito',sans-serif", fontSize: '0.88rem', fontWeight: 800,
    background: 'transparent', color: 'rgba(255,255,255,0.38)',
  },
  fieldLabel: {
    display: 'block', fontSize: '0.62rem', fontWeight: 900,
    color: 'rgba(255,255,255,0.45)', letterSpacing: '2.5px',
    textTransform: 'uppercase', marginBottom: 7,
  },
  inputStyle: {
    width: '100%', background: 'rgba(0,0,0,0.35)',
    border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 13,
    color: '#fff', fontFamily: "'Nunito',sans-serif",
    fontSize: '0.92rem', fontWeight: 700, padding: '12px 14px',
    outline: 'none', boxSizing: 'border-box',
  },
  settingsBox: {
    background: 'rgba(0,0,0,0.35)', border: '1.5px solid rgba(255,255,255,0.07)',
    borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 14,
  },
  settingRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  settingName: { fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)' },
  settingRange: { fontSize: '0.62rem', color: 'rgba(255,255,255,0.32)', fontWeight: 700, marginTop: 1 },
  settingControls: { display: 'flex', alignItems: 'center', gap: 10 },
  btnMinus: {
    width: 30, height: 30, borderRadius: 9, border: '1.5px solid rgba(255,45,120,0.3)',
    background: 'rgba(255,45,120,0.15)', color: '#ff2d78',
    fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  btnPlus: {
    width: 30, height: 30, borderRadius: 9, border: '1.5px solid rgba(0,229,255,0.3)',
    background: 'rgba(0,229,255,0.15)', color: '#00e5ff',
    fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  countVal: { fontSize: '1rem', fontWeight: 900, color: '#fff', minWidth: 26, textAlign: 'center' },
  actionBtnCreate: {
    width: '100%', padding: '14px 0', border: 'none', borderRadius: 15,
    fontFamily: "'Fredoka One',cursive", fontSize: '1.1rem', letterSpacing: 1,
    cursor: 'pointer', color: '#fff', marginTop: 4,
    background: 'linear-gradient(135deg,#ff2d78,#ff8c00)',
    boxShadow: '0 6px 28px rgba(255,45,120,0.4)',
  },
  actionBtnJoin: {
    width: '100%', padding: '14px 0', border: 'none', borderRadius: 15,
    fontFamily: "'Fredoka One',cursive", fontSize: '1.1rem', letterSpacing: 1,
    cursor: 'pointer', color: '#fff', marginTop: 4,
    background: 'linear-gradient(135deg,#00b4db,#0083b0)',
    boxShadow: '0 6px 28px rgba(0,229,255,0.3)',
  },
  pubSection: { maxWidth: 460, margin: '0 auto', position: 'relative', zIndex: 1 },
  divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' },
  divLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' },
  divTxt: {
    color: 'rgba(255,255,255,0.25)', fontSize: '0.62rem',
    fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
  },
  secTitle: {
    fontFamily: "'Fredoka One',cursive", fontSize: '1.2rem',
    color: '#fff', marginBottom: 12,
  },
  noRooms: {
    textAlign: 'center', color: 'rgba(255,255,255,0.25)',
    fontSize: '0.85rem', fontWeight: 700, padding: 24,
    background: 'rgba(255,255,255,0.02)', borderRadius: 16,
    border: '1.5px dashed rgba(255,255,255,0.08)',
  },
  roomCard: {
    background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 15, padding: '13px 18px', marginBottom: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  roomId: { fontFamily: "'Fredoka One',cursive", fontSize: '1rem', color: '#ffe600', letterSpacing: 1 },
  roomPlayers: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', fontWeight: 700, marginTop: 2 },
  roomJoinBtn: {
    background: 'linear-gradient(135deg,#ff2d78,#b44fff)', border: 'none',
    borderRadius: 10, padding: '8px 18px', color: '#fff',
    fontFamily: "'Nunito',sans-serif", fontSize: '0.8rem', fontWeight: 800,
    cursor: 'pointer', boxShadow: '0 3px 14px rgba(255,45,120,0.35)',
  },
  spaceY: { display: 'flex', flexDirection: 'column', gap: 14 },
};

const Home = ({ setRoomData }) => {
  const [tab, setTab] = useState('create');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const [settings, setSettings] = useState({ maxPlayers: 6, rounds: 3, drawTime: 60 });

  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  // 🌍 FETCH PUBLIC ROOMS
  useEffect(() => {
    socket.emit('get_public_rooms');
    socket.on('public_rooms', setPublicRooms);
    return () => socket.off('public_rooms');
  }, []);

  // 🧠 ROOM EVENTS
  useEffect(() => {
    socket.on('room_created', (data) => { setRoomData(data); navigate('/lobby'); });
    socket.on('joined_room',  (data) => { setRoomData(data); navigate('/lobby'); });
    socket.on('error', (err) => addNotification(err.message, 'error'));
    return () => {
      socket.off('room_created');
      socket.off('joined_room');
      socket.off('error');
    };
  }, []);

  const handleCreate = () => socket.emit('create_room', { hostName: playerName, settings });
  const handleJoin   = () => socket.emit('join_room',   { roomId, playerName });

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const adj   = (key, min, max, step, delta) =>
    setSettings(s => ({ ...s, [key]: clamp(s[key] + delta * step, min, max) }));

  const settingRows = [
    { key: 'maxPlayers', label: 'Players',   range: '2 – 20',    icon: '👥', min: 2,  max: 20,  step: 1  },
    { key: 'rounds',     label: 'Rounds',    range: '2 – 10',    icon: '🔄', min: 2,  max: 10,  step: 1  },
    { key: 'drawTime',   label: 'Draw Time', range: '15 – 240s', icon: '⏱️', min: 15, max: 240, step: 15 },
  ];

  return (
    <div style={S.root}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet" />

      {/* Blobs */}
      <div style={S.blob('-100px', '-100px', undefined, undefined, '#ff2d78', '380px')} />
      <div style={S.blob(undefined, undefined, '-60px', '-60px', '#00e5ff', '280px')} />
      <div style={S.blob('45%', '55%', undefined, undefined, '#ffe600', '200px')} />

      {/* Floating doodles */}
      <div style={S.doodle('10%', '5%', undefined, undefined, '2.4rem')}>🖍️</div>
      <div style={S.doodle('22%', undefined, '5%', undefined, '1.6rem')}>✏️</div>
      <div style={S.doodle(undefined, undefined, undefined, '22%', '2rem')}>🎨</div>
      <div style={S.doodle(undefined, undefined, '4%', '32%', '2.6rem')}>🏆</div>

      {/* ── HEADER ── */}
      <div style={S.header}>
        <div style={S.badgePill}>✨ Multiplayer Drawing Game</div>
        <div style={S.logoWrap}>
          <div style={S.logoIcon}>🎮</div>
          <div style={S.logoTitle}>Skribbl</div>
        </div>
        <p style={S.tagline}>Draw &nbsp;•&nbsp; Guess &nbsp;•&nbsp; Win</p>
      </div>

      {/* ── CARD ── */}
      <div style={S.card}>

        {/* Tabs */}
        <div style={S.tabs}>
          {['create', 'join'].map(t => (
            <button key={t} style={tab === t ? S.tabActive : S.tabInactive} onClick={() => setTab(t)}>
              {t === 'create' ? '🚀 Create Room' : '👥 Join Room'}
            </button>
          ))}
        </div>

        {/* ── CREATE TAB ── */}
        {tab === 'create' && (
          <div style={S.spaceY}>
            <div>
              <label style={S.fieldLabel}>Your Username</label>
              <Input
                placeholder="Enter your name..."
                style={S.inputStyle}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <div>
              <label style={S.fieldLabel}>Room Settings</label>
              <div style={S.settingsBox}>
                {settingRows.map(({ key, label, range, icon, min, max, step }) => (
                  <div style={S.settingRow} key={key}>
                    <div>
                      <div style={S.settingName}>{icon} {label}</div>
                      <div style={S.settingRange}>{range}</div>
                    </div>
                    <div style={S.settingControls}>
                      <button style={S.btnMinus} onClick={() => adj(key, min, max, step, -1)}>−</button>
                      <span style={S.countVal}>{settings[key]}</span>
                      <button style={S.btnPlus}  onClick={() => adj(key, min, max, step, +1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button style={S.actionBtnCreate} onClick={handleCreate}>🚀 Create Room</button>
          </div>
        )}

        {/* ── JOIN TAB ── */}
        {tab === 'join' && (
          <div style={S.spaceY}>
            <div>
              <label style={S.fieldLabel}>Room Code</label>
              <Input
                placeholder="e.g. ABC123"
                style={{ ...S.inputStyle, letterSpacing: '2px', textTransform: 'uppercase' }}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label style={S.fieldLabel}>Your Username</label>
              <Input
                placeholder="Enter your name..."
                style={S.inputStyle}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
            <button style={S.actionBtnJoin} onClick={handleJoin}>➤ Join Room</button>
          </div>
        )}
      </div>

      {/* ── PUBLIC ROOMS ── */}
      <div style={S.pubSection}>
        <div style={S.divider}>
          <div style={S.divLine} />
          <span style={S.divTxt}>or join public</span>
          <div style={S.divLine} />
        </div>

        <div style={S.secTitle}>🌍 Public Rooms</div>

        {publicRooms.length === 0 ? (
          <div style={S.noRooms}>No public rooms yet — be the first to create one! 🎨</div>
        ) : (
          publicRooms.map((room) => (
            <div key={room.roomId} style={S.roomCard}>
              <div>
                <div style={S.roomId}>{room.roomId}</div>
                <div style={S.roomPlayers}>👥 {room.playerCount} / {room.maxPlayers} players</div>
              </div>
              <button
                style={S.roomJoinBtn}
                onClick={() => { setRoomId(room.roomId); setTab('join'); }}
              >
                Join →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;