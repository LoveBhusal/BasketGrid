/// queryUtils.js
const categoryMapping = require('./categoryMapping.js');
const categoriesConfig = require('./categoriesConfig.json');
const { Prisma } = require('@prisma/client');

function constructCondition(category) {
    const categoryKey = Object.keys(categoriesConfig).find(key =>
        categoriesConfig[key].values.includes(category)
    );

    if (!categoryKey) {
        console.error(`Category not found for value: ${category}`);
        return {};
    }

    const mapping = categoryMapping[categoryKey];

    switch (categoryKey) {
        case 'Teams':
            return { [mapping]: { has: category } };
        case 'Colleges':
            return { [mapping]: { contains: category } };
        case 'Accolades':
            return constructAcoladesCondition(category, mapping[category]);
        case 'Draft':
            return constructDraftCondition(category, mapping);
        case 'Not USA':
            return { [mapping]: { equals: category } };
        case 'Statistics':
            if (!mapping[category]) {
                console.error(`No mapping found for Statistics category: ${category}`);
                return {};
            }
            return constructStatisticsCondition(category, mapping[category]);
        case 'ERA':
            return constructERACondition(category, mapping[category]);
        case 'Height':
            return constructHeightCondition(category, mapping[category]);
        case 'One Franchise':
            return constructOneFranchiseCondition(category, mapping[category]);
        case 'Not USA':
            return { [mapping]: category };
        default:
            return {};
    }
}

function constructAcoladesCondition(category, mapping) {
    return { [mapping.field]: { gte: mapping.minValue } };
}

function constructDraftCondition(value, mapping) {
    switch (value) {
        case '1st Round':
            return { "draft_round": { in: ['1'] } };
        case '2nd Round':
            return { "draft_round": { notIn: ['1'] } };
        case 'Top 10 pick':
            return { [mapping]: { in: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] } };
        case 'Top 5 pick':
            return { [mapping]: { in: ['1', '2', '3', '4', '5'] } };
        case 'Top 3 pick':
            return { [mapping]: { in: ['1', '2', '3'] } };
        default:
            return {};
    }
}

function constructOneFranchiseCondition(category, mapping) {
    if (!mapping || !mapping.field) {
        console.error(`Invalid mapping for Statistics category: ${category}`);
        return {};
    }
    return { [mapping.field]: { [mapping.operator]: mapping.value } };
  }
function constructStatisticsCondition(category, mapping) {
    if (!mapping || !mapping.field) {
        console.error(`Invalid mapping for Statistics category: ${category}`);
        return {};
    }
    return { [mapping.field]: { [mapping.operator]: mapping.value } };
}

function eraToIndex(year) {
    if (year >= 1960 && year < 1970) return 1;
    if (year >= 1970 && year < 1980) return 2;
    if (year >= 1980 && year < 1990) return 3;
    if (year >= 1990 && year < 2000) return 4;
    if (year >= 2000 && year < 2010) return 5;
    if (year >= 2010 && year < 2020) return 6;
    return null;
}

function constructERACondition(category, mapping) {
    const eraIndex = eraToIndex(mapping.from); // Get the index of the era

    return {
        OR: [
            // Direct match with from_year or to_year
            { from_year: { gte: mapping.from, lte: mapping.to } },
            { to_year: { gte: mapping.from, lte: mapping.to } },
            // Check if era index lies within the range of from_year and to_year
            {
                AND: [
                    { from_year: { lte: mapping.to } }, // Check that the era starts after the from_year
                    { to_year: { gte: mapping.from } }  // Check that the era ends before the to_year
                ]
            }
        ]
    };
}

// Example usage
const eraMapping = {
    "Played in 80s": { from: 1980, to: 1989 },
    "Played in 90s": { from: 1990, to: 1999 },
    "Played in 2000s": { from: 2000, to: 2009 }
};


function constructHeightCondition(category, mapping) {
    const [feet, inches] = mapping.value.split('-').map(Number);

    if (category === "Short Kings") {
        return {
            height: {
                lte: `${feet}-${inches.toString().padStart(2, '0')}`
            }
        };
    } else if (category === "7FT+") {
        return {
            height: {
                gte: `${feet}-${inches.toString().padStart(2, '0')}`
            }
        };
    }

    return {};
}



module.exports = { constructCondition };