//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { generateCategories } = require('./generateCategories');
const { Pool } = require('pg');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

const pool = new Pool({
  user: 'jamal',
  host: 'localhost',
  database: 'PlayerDatabase',
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
    const validPlayer = await prisma.player.findFirst({
      where: {
        player_name: playerName,
        AND: [
          { teams_played_for: { has: category1 } },
          { teams_played_for: { has: category2 } }
        ]
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

