// generateCategories.js
const categoriesConfig = require('./categoriesConfig.json');

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCategories() {
  const categories = [];
  let totalWeight = 0;
  for (let category in categoriesConfig) {
    totalWeight += categoriesConfig[category].weight;
  }

  while (categories.length < 6) {
    let randomWeight = Math.random() * totalWeight;
    for (let category in categoriesConfig) {
      if (randomWeight < categoriesConfig[category].weight) {
        if (category === 'Statistics') {
          const subCategories = categoriesConfig[category].subCategories;
          categories.push(getRandomElement(subCategories));
        } else {
          categories.push(getRandomElement(categoriesConfig[category].values));
        }
        break;
      }
      randomWeight -= categoriesConfig[category].weight;
    }
  }
  return categories;
}

module.exports = { generateCategories };
