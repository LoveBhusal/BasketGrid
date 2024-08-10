const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle creating or joining rooms
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle moves
  socket.on('move', (data) => {
    io.to(data.room).emit('move', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
