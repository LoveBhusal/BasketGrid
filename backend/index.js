const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { generateCategories } = require('./generateCategories');
const { Pool } = require('pg');
const { constructCondition } = require('./queryUtils');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to your frontend origin
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

const pool = new Pool({
  user: 'jamal',
  host: 'playerdatabase.chocck6i8uee.us-east-2.rds.amazonaws.com',
  database: 'playerdatabase',
  password: 'twopercent',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/players', async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const result = await prisma.player.findMany({
      where: {
        player_name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        player_name: true,
      },
      take: 25,
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/test', async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      take: 5,
    });
    res.json(players);
  } catch (error) {
    console.error('Error testing Prisma client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await generateCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error generating categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/validate-player', async (req, res) => {
    const { playerName, category1, category2 } = req.body;
    try {
        const conditions = [constructCondition(category1), constructCondition(category2)];
        const validPlayer = await prisma.player.findFirst({
            where: {
                player_name: playerName,
                AND: conditions
            }
        });
        if (validPlayer) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('findMatch', () => {
    findMatch(socket);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    io.to(room).emit('playerJoined', { room });
  });

  socket.on('move', (data) => {
    io.to(data.room).emit('move', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const waitingPlayers = [];

function findMatch(socket) {
  if (waitingPlayers.length > 0) {
    const opponent = waitingPlayers.pop();
    const room = `${socket.id}#${opponent.id}`;
    socket.join(room);
    opponent.join(room);
    io.to(room).emit('startGame', { room, players: [socket.id, opponent.id] });
  } else {
    waitingPlayers.push(socket);
  }
}
