/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

function GameCanvas({ roomId, room, hint }) {
  const isDrawer = room.host === socket.id;
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [wordOptions, setWordOptions] = useState([]);
  const [wordChosen, setWordChosen] = useState(false);

  useEffect(() => {
    socket.emit("game_ready", {
      roomId,
    });

    socket.on("choose_word", ({ wordOptions }) => {
      setWordChosen(false);
      setWordOptions(wordOptions);
      clearCanvasLocal();
    });

    return () => {
      socket.off("choose_word");
    };
  }, []);

  // Store all strokes
  const strokes = useRef([]);

  // =========================
  // CANVAS SETUP
  // =========================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctxRef.current = ctx;
  }, []);

  // =========================
  // CLEAR CANVAS LOCALLY
  // =========================
  function clearCanvasLocal() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.current = [];
  }

  // =========================
  // REDRAW ALL STROKES
  // =========================
  function redrawCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.current.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.beginPath();

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;

      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.stroke();
      ctx.closePath();
    });
  }

  // =========================
  // UNDO LAST STROKE
  // =========================
  function undoLastStroke() {
    if (strokes.current.length === 0) return;

    strokes.current.pop();

    redrawCanvas();
  }

  // =========================
  // SOCKET EVENTS
  // =========================
  useEffect(() => {
    // Remote user started drawing
    socket.on("draw_start", ({ stroke }) => {
      const ctx = ctxRef.current;

      if (!ctx) return;

      ctx.beginPath();

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;

      ctx.moveTo(stroke.x, stroke.y);

      // Save remote stroke
      strokes.current.push({
        color: stroke.color,
        size: stroke.size,
        points: [{ x: stroke.x, y: stroke.y }],
      });
    });

    // Remote drawing move
    socket.on("draw_move", ({ point }) => {
      const ctx = ctxRef.current;

      if (!ctx) return;

      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      // Save points
      const lastStroke = strokes.current[strokes.current.length - 1];

      if (lastStroke) {
        lastStroke.points.push({
          x: point.x,
          y: point.y,
        });
      }
    });

    // Remote draw end
    socket.on("draw_end", () => {
      const ctx = ctxRef.current;

      if (!ctx) return;

      ctx.closePath();
    });

    // Clear canvas
    socket.on("clear_canvas", () => {
      clearCanvasLocal();
    });

    // Undo canvas
    socket.on("undo_canvas", () => {
      undoLastStroke();
    });

    return () => {
      socket.off("draw_start");
      socket.off("draw_move");
      socket.off("draw_end");
      socket.off("clear_canvas");
      socket.off("undo_canvas");
    };
  }, []);

  // =========================
  // START DRAWING
  // =========================
  const startDrawing = (e) => {
    if (!isDrawer) return;

    drawing.current = true;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = ctxRef.current;

    if (!ctx) return;

    ctx.beginPath();

    const currentColor = isErasing ? "#FFFFFF" : color;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;

    ctx.moveTo(x, y);

    const newStroke = {
      color: currentColor,
      size: brushSize,
      points: [{ x, y }],
    };

    strokes.current.push(newStroke);

    socket.emit("draw_start", {
      roomId,
      stroke: {
        x,
        y,
        color: currentColor,
        size: brushSize,
      },
    });
  };

  // =========================
  // DRAW
  // =========================
  const draw = (e) => {
    if (!isDrawer) return;

    if (!drawing.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = ctxRef.current;

    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    const lastStroke = strokes.current[strokes.current.length - 1];

    if (lastStroke) {
      lastStroke.points.push({ x, y });
    }

    socket.emit("draw_move", {
      roomId,
      point: { x, y },
    });
  };

  // =========================
  // STOP DRAWING
  // =========================
  const stopDrawing = () => {
    if (!drawing.current) return;

    drawing.current = false;

    const ctx = ctxRef.current;

    if (!ctx) return;

    ctx.closePath();

    socket.emit("draw_end", {
      roomId,
    });
  };

  // =========================
  // CLEAR CANVAS
  // =========================
  const clearCanvas = () => {
    if (!isDrawer) return;
    clearCanvasLocal();

    socket.emit("clear_canvas", {
      roomId,
    });
  };

  // =========================
  // UNDO
  // =========================
  const undo = () => {
    if (!isDrawer) return;
    undoLastStroke();

    socket.emit("undo_canvas", {
      roomId,
    });
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
        {/* COLOR PICKER */}
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">🎨 Color</span>

          <input
            type="color"
            value={color}
            disabled={isErasing}
            onChange={(e) => setColor(e.target.value)}
            className="w-14 h-14 rounded-xl border-none cursor-pointer"
          />
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">🖌️ Size</span>

          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="cursor-pointer"
          />

          <span className="text-white font-bold">{brushSize}px</span>
        </div>

        {/* ERASER */}
        <button
          onClick={() => setIsErasing(!isErasing)}
          className={`px-6 py-3 rounded-2xl font-bold transition duration-300
            ${
              isErasing
                ? "bg-red-500 text-white shadow-lg"
                : "bg-white text-black"
            }
          `}
        >
          🩹 Eraser
        </button>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Clear
        </button>

        {/* Undo Button */}
        <button
          onClick={undo}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Undo
        </button>
        {isDrawer ? (
          <div className="min-w-[250px]">
            <select
              defaultValue=""
              disabled={wordChosen}
              onChange={(e) => {
                const selectedWord = e.target.value;

                socket.emit("choose_word", {
                  roomId,
                  word: selectedWord,
                });

                setWordChosen(true);
              }}
              className="w-full bg-white text-black px-4 py-3 rounded-xl border-2 border-pink-500 font-bold min-w-[250px]"
            >
              <option
                value=""
                disabled
                style={{
                  color: "black",
                }}
              >
                🎯 Choose Word
              </option>

              {wordOptions?.map((word, index) => (
                <option
                  key={index}
                  value={word}
                  style={{
                    color: "black",
                    background: "white",
                  }}
                >
                  {word}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-yellow-400/20 text-yellow-300 px-5 py-3 rounded-2xl font-bold">
            💡 Hint: {hint || "_ _ _"}
          </div>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{
          cursor: isDrawer ? "crosshair" : "not-allowed",
          background: "white",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

export default GameCanvas;
