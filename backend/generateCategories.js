const categoriesConfig = require('./categoriesConfig.json');
const categoryMapping = require('./categoryMapping.js');
const { PrismaClient } = require('@prisma/client');
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

    // Ensure minimum one team
    categories.push(getRandomElement(categoriesConfig.Teams.values));
    selectedCategories.Teams = true;

    while (categories.length < 6) {
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

                // Get a subcategory
                let subCategory = getRandomElement(categoriesConfig[category].values);

                // Check for specific keywords constraints in Statistics
                if (category === 'Statistics') {
                    const keywords = ["PTS"];
                    let keywordFound = keywords.some(keyword => 
                        subCategory.includes(keyword) && selectedKeywords.Statistics.includes(keyword)
                    );
                    if (keywordFound) continue;
                }

                // Check for specific keywords constraints in Accolades
                if (category === 'Accolades') {
                    const keywords = ["Star", "NBA", "Defense"];
                    let keywordFound = keywords.some(keyword => 
                        subCategory.includes(keyword) && selectedKeywords.Accolades.includes(keyword)
                    );
                    if (keywordFound) continue;
                }

                // Ensure no duplicates
                if (!categories.includes(subCategory)) {
                    categories.push(subCategory);
                    // Update selected categories and keywords
                    if (category === 'Statistics') {
                        selectedCategories.Statistics = true;
                        const keywords = ["PTS"];
                        keywords.forEach(keyword => {
                            if (subCategory.includes(keyword)) {
                                selectedKeywords.Statistics.push(keyword);
                            }
                        });
                    }
                    if (category === 'Accolades') {
                        const keywords = ["Star", "NBA", "Defense"];
                        keywords.forEach(keyword => {
                            if (subCategory.includes(keyword)) {
                                selectedKeywords.Accolades.push(keyword);
                            }
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

function constructCondition(category) {
    const categoryKey = Object.keys(categoriesConfig).find(key => 
        categoriesConfig[key].values.includes(category)
    );

    if (!categoryKey) {
        console.error(`Category not found for value: ${category}`);
        return {};
    }

    const mapping = categoryMapping[categoryKey];

    if (typeof mapping === 'string') {
        return { [mapping]: { has: category } };
    }

    switch (categoryKey) {
        case 'Teams':
        case 'Colleges':
            return { [mapping]: { has: category } };
        case 'Accolades':
            return constructAcoladesCondition(category, mapping[category]);
        case 'Draft':
            return constructDraftCondition(category);
        case 'Not USA':
            return { [mapping]: { not: 'USA' } };
        case 'Statistics':
            return constructStatisticsCondition(category, mapping[category]);
        case 'ERA':
            return constructERACondition(category, mapping[category]);
        case 'Height':
            return constructHeightCondition(category, mapping[category]);
        case 'One Franchise':
            return constructOneFranchiseCondition(category, mapping[category]);
        default:
            return {};
    }
}

function constructAcoladesCondition(category, mapping) {
    return { [mapping.field]: { gte: mapping.minValue } };
}

function constructDraftCondition(value) {
    switch (value) {
        case '1st Round':
            return { [categoryMapping.Draft]: 1 };
        case '2nd Round':
            return { [categoryMapping.Draft]: 2 };
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

function constructStatisticsCondition(category, mapping) {
    return { [mapping.field]: { [mapping.operator]: mapping.value } };
}

function constructERACondition(category, mapping) {
    return { 
        OR: [
            { from_year: { gte: mapping.from, lte: mapping.to } },
            { to_year: { gte: mapping.from, lte: mapping.to } }
        ]
    };
}

function constructHeightCondition(category, mapping) {
    const [feet, inches] = mapping.value.split('-').map(Number);
    const totalInches = feet * 12 + inches;
    return { height_inches: { [mapping.operator]: totalInches } };
}

function constructOneFranchiseCondition(category, mapping) {
    return { [mapping.field]: { [mapping.operator]: mapping.value } };
}

module.exports = { generateCategories };