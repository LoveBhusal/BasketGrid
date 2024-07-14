// generateCategories.js

const categoriesConfig = require('./categoriesConfig.json');
const categoryMapping = require('./categoryMapping.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function validateCategories(categories) {
  const checks = [
    [categories[0], categories[3]],
    [categories[0], categories[4]],
    [categories[0], categories[5]],
    [categories[1], categories[3]],
    [categories[1], categories[4]],
    [categories[1], categories[5]],
    [categories[2], categories[3]],
    [categories[2], categories[4]],
    [categories[2], categories[5]]
  ];

  for (let [col, row] of checks) {
    const colField = categoryMapping[col.category] || col.category;
    const rowField = categoryMapping[row.category] || row.category;
    const colValue = col.value;
    const rowValue = row.value;

    // Construct Prisma query based on the type of field
    let colCondition, rowCondition;

    if (Array.isArray(colField)) {
      // Handle cases like ERA where the field is a range
      colCondition = {
        AND: [
          { [colField[0]]: { lte: colValue } },
          { [colField[1]]: { gte: colValue } }
        ]
      };
    } else if (typeof colField === 'object') {
      colCondition = { [colField[colValue]]: true };
    } else {
      colCondition = { [colField]: colValue };
    }

    if (Array.isArray(rowField)) {
      // Handle cases like ERA where the field is a range
      rowCondition = {
        AND: [
          { [rowField[0]]: { lte: rowValue } },
          { [rowField[1]]: { gte: rowValue } }
        ]
      };
    } else if (typeof rowField === 'object') {
      rowCondition = { [rowField[rowValue]]: true };
    } else {
      rowCondition = { [rowField]: rowValue };
    }

    const validPlayers = await prisma.player.findMany({
      where: {
        AND: [colCondition, rowCondition]
      }
    });

    if (validPlayers.length === 0) {
      return false;
    }
  }

  return true;
}

async function generateCategories() {
  let categories;
  let isValid = false;

  while (!isValid) {
    categories = [];
    const selectedCategories = { Teams: false, Draft: false, Statistics: false };
    const selectedKeywords = { Statistics: [], Accolades: [] };
    let totalWeight = 0;

    for (let category in categoriesConfig) {
      totalWeight += categoriesConfig[category].weight;
    }

    // Ensure minimum one team
    categories.push({ category: 'Teams', value: getRandomElement(categoriesConfig.Teams.values) });
    selectedCategories.Teams = true;

    while (categories.length < 6) {
      let randomWeight = Math.random() * totalWeight;
      for (let category in categoriesConfig) {
        if (randomWeight < categoriesConfig[category].weight) {
          if (category === 'Statistics' && selectedCategories.Statistics) continue;
          if (category === 'Draft' && selectedCategories.Draft) continue;

          let subCategory = getRandomElement(categoriesConfig[category].values);

          // Check for specific keywords constraints in Statistics
          if (category === 'Statistics') {
            const keywords = ["PTS"];
            if (keywords.some(keyword => subCategory.includes(keyword) && selectedKeywords.Statistics.includes(keyword))) continue;
          }

          // Check for specific keywords constraints in Accolades
          if (category === 'Accolades') {
            const keywords = ["Star", "NBA", "Defense"];
            if (keywords.some(keyword => subCategory.includes(keyword) && selectedKeywords.Accolades.includes(keyword))) continue;
          }

          if (!categories.some(cat => cat.value === subCategory)) {
            categories.push({ category, value: subCategory });

            if (category === 'Statistics') {
              selectedCategories.Statistics = true;
              const keywords = ["PTS"];
              keywords.forEach(keyword => {
                if (subCategory.includes(keyword)) selectedKeywords.Statistics.push(keyword);
              });
            }

            if (category === 'Accolades') {
              const keywords = ["Star", "NBA", "Defense"];
              keywords.forEach(keyword => {
                if (subCategory.includes(keyword)) selectedKeywords.Accolades.push(keyword);
              });
            }

            if (category === 'Draft') selectedCategories.Draft = true;
            if (category === 'Teams') selectedCategories.Teams = true;
          }
          break;
        }
        randomWeight -= categoriesConfig[category].weight;
      }
    }

    isValid = await validateCategories(categories);
  }

  return categories.map(cat => cat.value);
}

module.exports = { generateCategories };
