const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5001;

// PostgreSQL connection
const pool = new Pool({
  user: 'jamal',
  host: 'localhost',
  database: 'PlayerDatabase',
  password: 'twopercent',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Endpoint to search players by name
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
