
// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import Button from './Button';

// const DrawingCanvas = ({
//   isDrawer,
//   color,
//   brushSize,
//   onColorChange,
//   onBrushSizeChange,
//   wordLength,
//   timeLeft,
//   totalTime,
//   roomId,
//   socket,
//   onClear
// }) => {
//   const canvasRef = useRef(null);
//   const [ctx, setCtx] = useState(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [tool, setTool] = useState('pen'); // 'pen' or 'eraser'
//   const strokesRef = useRef([]);
//   const lastPointRef = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const context = canvas.getContext('2d');
//       context.lineCap = 'round';
//       context.lineJoin = 'round';
//       context.shadowBlur = 10;
//       context.shadowColor = 'rgba(0,0,0,0.3)';
//       setCtx(context);
//       canvas.width = 900;
//       canvas.height = 650;
//     }
//   }, []);

//   useEffect(() => {
//     if (!socket || !roomId || !ctx) return;

//     const handleDrawMove = (data) => {
//       ctx.strokeStyle = data.color || '#000000';
//       ctx.lineWidth = data.brushSize || 5;
//       ctx.beginPath();
//       ctx.moveTo(data.fromX, data.fromY);
//       ctx.lineTo(data.toX, data.toY);
//       ctx.stroke();
//     };

//     const handleCanvasClear = () => {
//       ctx.clearRect(0, 0, 900, 650);
//       strokesRef.current = [];
//     };

//     socket.on('draw_move', handleDrawMove);
//     socket.on('canvas_clear', handleCanvasClear);

//     return () => {
//       socket.off('draw_move', handleDrawMove);
//       socket.off('canvas_clear', handleCanvasClear);
//     };
//   }, [ctx, socket, roomId]);

//   const getMousePos = useCallback((e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
    
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: ((e.clientX - rect.left) * 900) / rect.width,
//       y: ((e.clientY - rect.top) * 650) / rect.height
//     };
//   }, []);

//   const startDrawing = useCallback((e) => {
//     if (!isDrawer || !ctx) return;
//     setIsDrawing(true);
//     const pos = getMousePos(e.nativeEvent);
//     lastPointRef.current = pos;
//   }, [ctx, isDrawer, getMousePos]);

//   const draw = useCallback((e) => {
//     if (!isDrawing || !ctx || !isDrawer) return;
//     const pos = getMousePos(e.nativeEvent);
    
//     if (tool === 'eraser') {
//       ctx.clearRect(pos.x - brushSize/2, pos.y - brushSize/2, brushSize, brushSize);
//     } else {
//       ctx.strokeStyle = color;
//       ctx.lineWidth = brushSize;
//       ctx.lineCap = 'round';
//       ctx.lineJoin = 'round';
//       ctx.beginPath();
//       ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
//       ctx.lineTo(pos.x, pos.y);
//       ctx.stroke();
//     }

//     strokesRef.current.push({
//       fromX: lastPointRef.current.x,
//       fromY: lastPointRef.current.y,
//       toX: pos.x,
//       toY: pos.y,
//       color: tool === 'eraser' ? 'transparent' : color,
//       brushSize,
//       tool
//     });

//     socket?.emit('room_event', {
//       roomId,
//       event: 'draw_move',
//       data: {
//         fromX: lastPointRef.current.x,
//         fromY: lastPointRef.current.y,
//         toX: pos.x,
//         toY: pos.y,
//         color: tool === 'eraser' ? 'transparent' : color,
//         brushSize,
//         tool
//       }
//     });

//     lastPointRef.current = pos;
//   }, [isDrawing, ctx, isDrawer, color, brushSize, tool, getMousePos, socket, roomId]);

//   const endDrawing = useCallback(() => {
//     setIsDrawing(false);
//   }, []);

//   const handleClear = () => {
//     if (ctx) {
//       ctx.clearRect(0, 0, 900, 650);
//       strokesRef.current = [];
//       socket?.emit('room_event', {
//         roomId,
//         event: 'canvas_clear',
//         data: {}
//       });
//       onClear?.();
//     }
//   };

//   const handleUndo = () => {
//     if (strokesRef.current.length > 0) {
//       strokesRef.current.pop();
//       ctx.clearRect(0, 0, 900, 650);
//       strokesRef.current.forEach(stroke => {
//         if (stroke.tool === 'eraser') {
//           ctx.clearRect(stroke.fromX - stroke.brushSize/2, stroke.fromY - stroke.brushSize/2, stroke.brushSize, stroke.brushSize);
//         } else {
//           ctx.strokeStyle = stroke.color;
//           ctx.lineWidth = stroke.brushSize;
//           ctx.beginPath();
//           ctx.moveTo(stroke.fromX, stroke.fromY);
//           ctx.lineTo(stroke.toX, stroke.toY);
//           ctx.stroke();
//         }
//       });
//       socket?.emit('room_event', {
//         roomId,
//         event: 'undo',
//         data: {}
//       });
//     }
//   };

//   return (
//     <div className="space-y-3">
//       {/* Tools Panel */}
//       {isDrawer && (
//         <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 flex flex-wrap gap-4 items-end">
//           {/* Color Picker */}
//           <div>
//             <label className="block text-xs font-bold text-slate-300 mb-2">🎨 Color</label>
//             <input
//               type="color"
//               value={color}
//               onChange={onColorChange}
//               className="w-14 h-14 rounded-lg cursor-pointer border-2 border-slate-600 hover:border-violet-500 transition-all"
//             />
//           </div>

//           {/* Brush Size */}
//           <div className="flex-1 min-w-48">
//             <label className="block text-xs font-bold text-slate-300 mb-2">✏️ Brush Size</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="range"
//                 min="2"
//                 max="50"
//                 value={brushSize}
//                 onChange={onBrushSizeChange}
//                 className="flex-1 h-2 bg-slate-700 rounded-lg cursor-pointer accent-violet-500"
//               />
//               <span className="text-sm font-bold text-slate-300 w-8">{brushSize}</span>
//             </div>
//           </div>

//           {/* Tool Selection */}
//           <div>
//             <label className="block text-xs font-bold text-slate-300 mb-2">🛠️ Tool</label>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setTool('pen')}
//                 className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
//                   tool === 'pen'
//                     ? 'bg-violet-600 text-white'
//                     : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
//                 }`}
//               >
//                 ✏️ Pen
//               </button>
//               <button
//                 onClick={() => setTool('eraser')}
//                 className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
//                   tool === 'eraser'
//                     ? 'bg-red-600 text-white'
//                     : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
//                 }`}
//               >
//                 🧹 Eraser
//               </button>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <Button variant="danger" onClick={handleClear} size="sm" icon="🗑️">
//               Clear
//             </Button>
//             <Button variant="secondary" onClick={handleUndo} size="sm" icon="↶">
//               Undo
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Canvas */}
//       <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-dashed border-sky-300">
//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={endDrawing}
//           onMouseOut={endDrawing}
//           className="w-full block cursor-crosshair"
//         />
//       </div>

//       {/* Non-Drawer Info */}
//       {!isDrawer && (
//         <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 text-center">
//           <p className="text-sm text-indigo-300">👀 Watch the drawing and make your guess!</p>
//           {wordLength > 0 && (
//             <p className="text-lg font-mono font-bold text-blue-400 mt-2">
//               {Array.from({ length: wordLength }).map((_, i) => '_').join(' ')}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DrawingCanvas;


import React, { useRef, useEffect, useState, useCallback } from 'react';
import Button from './Button';

const DrawingCanvas = ({
  isDrawer,
  color,
  brushSize,
  onColorChange,
  onBrushSizeChange,
  wordLength,
  timeLeft,
  totalTime,
  roomId,
  socket,
  onClear
}) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' or 'eraser'
  const strokesRef = useRef([]);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // ✅ REDUCED CANVAS SIZE: 700x500 (from 900x650)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.shadowBlur = 8; // Slightly reduced shadow
      context.shadowColor = 'rgba(0,0,0,0.3)';
      setCtx(context);
      canvas.width = 700;  // Smaller width
      canvas.height = 500; // Smaller height
    }
  }, []);

  useEffect(() => {
    if (!socket || !roomId || !ctx) return;

    const handleDrawMove = (data) => {
      ctx.strokeStyle = data.color || '#000000';
      ctx.lineWidth = data.brushSize || 5;
      ctx.beginPath();
      ctx.moveTo(data.fromX, data.fromY);
      ctx.lineTo(data.toX, data.toY);
      ctx.stroke();
    };

    const handleCanvasClear = () => {
      ctx.clearRect(0, 0, 700, 500); // Updated dimensions
      strokesRef.current = [];
    };

    socket.on('draw_move', handleDrawMove);
    socket.on('canvas_clear', handleCanvasClear);

    return () => {
      socket.off('draw_move', handleDrawMove);
      socket.off('canvas_clear', handleCanvasClear);
    };
  }, [ctx, socket, roomId]);

  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    // Updated for new canvas size (700x500)
    return {
      x: ((e.clientX - rect.left) * 700) / rect.width,
      y: ((e.clientY - rect.top) * 500) / rect.height
    };
  }, []);

  const startDrawing = useCallback((e) => {
    if (!isDrawer || !ctx) return;
    setIsDrawing(true);
    const pos = getMousePos(e.nativeEvent);
    lastPointRef.current = pos;
  }, [ctx, isDrawer, getMousePos]);

  const draw = useCallback((e) => {
    if (!isDrawing || !ctx || !isDrawer) return;
    const pos = getMousePos(e.nativeEvent);
    
    if (tool === 'eraser') {
      ctx.clearRect(pos.x - brushSize/2, pos.y - brushSize/2, brushSize, brushSize);
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    strokesRef.current.push({
      fromX: lastPointRef.current.x,
      fromY: lastPointRef.current.y,
      toX: pos.x,
      toY: pos.y,
      color: tool === 'eraser' ? 'transparent' : color,
      brushSize,
      tool
    });

    socket?.emit('room_event', {
      roomId,
      event: 'draw_move',
      data: {
        fromX: lastPointRef.current.x,
        fromY: lastPointRef.current.y,
        toX: pos.x,
        toY: pos.y,
        color: tool === 'eraser' ? 'transparent' : color,
        brushSize,
        tool
      }
    });

    lastPointRef.current = pos;
  }, [isDrawing, ctx, isDrawer, color, brushSize, tool, getMousePos, socket, roomId]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleClear = () => {
    if (ctx) {
      ctx.clearRect(0, 0, 700, 500); // Updated dimensions
      strokesRef.current = [];
      socket?.emit('room_event', {
        roomId,
        event: 'canvas_clear',
        data: {}
      });
      onClear?.();
    }
  };

  const handleUndo = () => {
    if (strokesRef.current.length > 0) {
      strokesRef.current.pop();
      ctx.clearRect(0, 0, 700, 500); // Updated dimensions
      strokesRef.current.forEach(stroke => {
        if (stroke.tool === 'eraser') {
          ctx.clearRect(stroke.fromX - stroke.brushSize/2, stroke.fromY - stroke.brushSize/2, stroke.brushSize, stroke.brushSize);
        } else {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.brushSize;
          ctx.beginPath();
          ctx.moveTo(stroke.fromX, stroke.fromY);
          ctx.lineTo(stroke.toX, stroke.toY);
          ctx.stroke();
        }
      });
      socket?.emit('room_event', {
        roomId,
        event: 'undo',
        data: {}
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* ✅ COMPACT Tools Panel */}
      {isDrawer && (
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-3 flex flex-wrap gap-3 items-end">
          {/* Color Picker - Smaller */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Color</label>
            <input
              type="color"
              value={color}
              onChange={onColorChange}
              className="w-12 h-12 rounded border-2 border-slate-600 hover:border-violet-400 transition-all cursor-pointer shadow-sm"
              title="Pick color"
            />
          </div>

          {/* Brush Size - More Compact */}
          <div className="flex-1 min-w-[160px] space-y-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Brush</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={brushSize}
                onChange={onBrushSizeChange}
                className="flex-1 h-1.5 bg-slate-700 rounded-full cursor-pointer accent-violet-500 shadow-sm"
              />
              <span className="text-xs font-bold text-slate-200 w-6 text-center">{brushSize}</span>
            </div>
          </div>

          {/* ✅ CONSISTENT Tool Buttons */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Tool</label>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setTool('pen')}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-all shadow-sm ${
                  tool === 'pen'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-400 shadow-violet-500/25'
                    : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-white'
                }`}
                title="Pen tool"
              >
                ✏️ Pen
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-all shadow-sm ${
                  tool === 'eraser'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-400 shadow-red-500/25'
                    : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-white'
                }`}
                title="Eraser tool"
              >
                🧹 Eraser
              </button>
            </div>
          </div>

          {/* ✅ CONSISTENT Action Buttons - Same size as tools */}
          <div className="flex flex-col gap-1">
            <Button 
              variant="danger" 
              onClick={handleClear} 
              size="xs" 
              icon="🗑️"
              className="px-3 py-1.5 h-auto text-xs font-semibold shadow-sm"
            >
              Clear
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleUndo} 
              size="xs" 
              icon="↶"
              className="px-3 py-1.5 h-auto text-xs font-semibold shadow-sm"
            >
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Smaller Canvas Container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-3 border-sky-200/50">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          className="w-full h-[500px] block cursor-crosshair hover:cursor-cell"
        />
      </div>

      {/* Non-Drawer Info - More Compact */}
      {!isDrawer && (
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-600/50 rounded-xl p-3 text-center backdrop-blur-sm">
          <p className="text-sm text-indigo-200 font-medium">👀 Guess the drawing!</p>
          {wordLength > 0 && (
            <p className="text-lg font-mono font-bold text-blue-300 mt-1 tracking-wider bg-black/20 px-3 py-1 rounded">
              {Array.from({ length: wordLength }).map((_, i) => '_').join(' ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
