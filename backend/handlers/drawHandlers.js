module.exports = (io, socket) => {

  socket.on("draw_start", ({ roomId, stroke }) => {
    socket.to(roomId).emit("draw_start", { stroke });
  });

  socket.on("draw_move", ({ roomId, point }) => {
    socket.to(roomId).emit("draw_move", { point });
  });

  socket.on("draw_end", ({ roomId }) => {
    socket.to(roomId).emit("draw_end");
  });

  socket.on("clear_canvas", ({ roomId }) => {
    io.to(roomId).emit("clear_canvas");
  });

  socket.on("undo_canvas", ({ roomId }) => {
    io.to(roomId).emit("undo_canvas");
  });

};