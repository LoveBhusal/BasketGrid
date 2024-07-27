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

function constructOneFranchiseCondition(value, mapping) {
    const field = 'teams_played_for'; // Use the actual field name directly
  
    switch (value) {
      case 'Loyal':
        return {
          AND: [
            { [field]: { isEmpty: false } },
            { NOT: { [field]: { has: null } } },
            { NOT: { [field]: { has: '' } } },
            { NOT: { [field]: { has: 'SECOND_TEAM_PLACEHOLDER' } } }
          ]
        };
      case 'Journeyman(5+ teams)':
        return {
          AND: [
            { [field]: { has: 'FIRST_TEAM_PLACEHOLDER' } },
            { [field]: { has: 'SECOND_TEAM_PLACEHOLDER' } },
            { [field]: { has: 'THIRD_TEAM_PLACEHOLDER' } },
            { [field]: { has: 'FOURTH_TEAM_PLACEHOLDER' } },
            { [field]: { has: 'FIFTH_TEAM_PLACEHOLDER' } }
          ]
        };
      default:
        return {};
    }
  }
function constructStatisticsCondition(category, mapping) {
    if (!mapping || !mapping.field) {
        console.error(`Invalid mapping for Statistics category: ${category}`);
        return {};
    }
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