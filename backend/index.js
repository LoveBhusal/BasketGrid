const express = require('express');
const cors = require('cors');
//const { PrismaClient } = require('@prisma/client');
const { generateCategories } = require('./generateCategories');
const { Pool } = require('pg');

const app = express();
//const prisma = new PrismaClient();
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
    const result = await pool.query(
      'SELECT player_name FROM players WHERE player_name ILIKE $1 LIMIT 10',
      [`%${searchQuery}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/categories', (req, res) => {
  const categories = generateCategories();
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

