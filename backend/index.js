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

const fs = require('fs');
const path = require('path');

// Read the Categories config file
const categoriesConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'categoriesConfig.json'), 'utf8'));

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

function constructCondition(category) {
    console.log(category);
    
    // Determine which category the value belongs to
    const categoryKey = Object.keys(categoriesConfig).find(key => 
        categoriesConfig[key].values.includes(category)
    );

    if (!categoryKey) {
        console.error(`Category not found for value: ${category}`);
        return {};
    }

    switch (categoryKey) {
        case 'Teams':
            return { teams_played_for: { has: category } };
        case 'Statistics':
            return constructStatisticsCondition(category);
        case 'Colleges':
            return { colleges: { has: category } };
        case 'Accolades':
            return { accolades: { has: category } };
        case 'Draft':
            return constructDraftCondition(category);
        case 'Not USA':
            return { country: { not: 'USA' } };
        case 'ERA':
            return constructERACondition(category);
        case 'Height':
            return constructHeightCondition(category);
        case 'One Franchise':
            return category === 'Loyal' ? { teams_played_for: { size: 1 } } : { teams_played_for: { size: { gte: 5 } } };
        default:
            return {};
    }
}

function constructStatisticsCondition(value) {
    const [stat, operator, threshold] = value.split(' ');
    const condition = operator === '>' ? 'gt' : 'lt';
    return { [stat.toLowerCase()]: { [condition]: parseFloat(threshold) } };
}

function constructDraftCondition(value) {
    switch (value) {
        case '1st Round':
            return { draft_round: 1 };
        case '2nd Round':
            return { draft_round: 2 };
        case 'Top 10 pick':
            return { draft_position: { lte: 10 } };
        case 'Top 5 pick':
            return { draft_position: { lte: 5 } };
        case 'Top 3 pick':
            return { draft_position: { lte: 3 } };
        default:
            return {};
    }
}

function constructERACondition(value) {
    switch (value) {
        case 'Played in 80s':
            return { 
                OR: [
                    { debut_year: { gte: 1980, lt: 1990 } },
                    { final_year: { gte: 1980, lt: 1990 } }
                ]
            };
        case 'Played in 90s':
            return { 
                OR: [
                    { debut_year: { gte: 1990, lt: 2000 } },
                    { final_year: { gte: 1990, lt: 2000 } }
                ]
            };
        case 'Played in 2000s':
            return { 
                OR: [
                    { debut_year: { gte: 2000, lt: 2010 } },
                    { final_year: { gte: 2000, lt: 2010 } }
                ]
            };
        default:
            return {};
    }
}

function constructHeightCondition(value) {
    switch (value) {
        case 'Short Kings':
            return { height_inches: { lt: 72 } }; // Less than 6 feet
        case '7FT+':
            return { height_inches: { gte: 84 } }; // 7 feet or taller
        default:
            return {};
    }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});