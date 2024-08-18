const categoriesConfig = require('./categoriesConfig.json');

const { PrismaClient } = require('@prisma/client');
const { constructCondition } = require('./queryUtils');
const prisma = new PrismaClient();

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateCategories() {
  let validCategories = false;
  let categories;

  while (!validCategories) {
    categories = generateCategoriesAttempt();
    validCategories = await validateCategories(categories);
  }

  return categories;
}
function generateCategoriesAttempt() {
  const categories = [];
  const selectedCategories = {
    Teams: false,
    Draft: false,
    Statistics: false,
  };
  const selectedKeywords = {
    Statistics: [],
    Accolades: []
  };
  let totalWeight = 0;
  for (let category in categoriesConfig) {
    totalWeight += categoriesConfig[category].weight;
  }

  // Ensure minimum one team at the 4th position (index 3)
  while (categories.length < 6) {
    if (categories.length === 3) {
      let team;
      do {
        team = getRandomElement(categoriesConfig.Teams.values);
      } while (categories.includes(team)); // Ensure no duplicate team

      categories.push(team);
      selectedCategories.Teams = true;
    } else {
      let randomWeight = Math.random() * totalWeight;
      for (let category in categoriesConfig) {
        if (randomWeight < categoriesConfig[category].weight) {
          // Check for category constraints
          if (category === 'Statistics' && selectedCategories.Statistics) {
            continue;
          }
          if (category === 'Draft' && selectedCategories.Draft) {
            continue;
          }
          if (category === 'Teams' && selectedCategories.Teams) {
            continue; // Skip if a team has already been selected
          }

          // Get a subcategory
          let subCategory;
          do {
            subCategory = getRandomElement(categoriesConfig[category].values);
          } while (categories.includes(subCategory)); // Ensure no duplicates

          // Check for specific keywords constraints in Statistics
          if (category === 'Statistics') {
            const keywords = ["PTS"];
            let keywordFound = false;
            for (let keyword of keywords) {
              if (subCategory.includes(keyword) && selectedKeywords.Statistics.includes(keyword)) {
                keywordFound = true;
                break;
              }
            }
            if (keywordFound) continue;
          }

          // Check for specific keywords constraints in Accolades
          if (category === 'Accolades') {
            const keywords = ["Star", "NBA", "Defense"];
            let keywordFound = false;
            for (let keyword of keywords) {
              if (subCategory.includes(keyword) && selectedKeywords.Accolades.includes(keyword)) {
                keywordFound = true;
                break;
              }
            }
            if (keywordFound) continue;
          }

          categories.push(subCategory);

          // Update selected categories and keywords
          if (category === 'Statistics') {
            selectedCategories.Statistics = true;
            const keywords = ["PTS"];
            for (let keyword of keywords) {
              if (subCategory.includes(keyword)) {
                selectedKeywords.Statistics.push(keyword);
              }
            }
          }
          if (category === 'Accolades') {
            const keywords = ["Star", "NBA", "Defense"];
            for (let keyword of keywords) {
              if (subCategory.includes(keyword)) {
                selectedKeywords.Accolades.push(keyword);
              }
            }
          }
          if (category === 'Draft') selectedCategories.Draft = true;
          if (category === 'Teams') selectedCategories.Teams = true;

          break;
        }
        randomWeight -= categoriesConfig[category].weight;
      }
    }
  }
  return categories;
}

async function validateCategories(categories) {
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 6; j++) {
      const validPlayer = await prisma.player.findFirst({
        where: {
          AND: [
            constructCondition(categories[i]),
            constructCondition(categories[j])
          ]
        }
      });
      if (!validPlayer) {
        console.log(`No valid player found for categories: ${categories[i]} and ${categories[j]}`);
        return false;
      }
    }
  }
  return true;
}
module.exports = { generateCategories };
