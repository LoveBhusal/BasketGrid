/// queryUtils.js
const categoryMapping = require('./categoryMapping.js');
const categoriesConfig = require('./categoriesConfig.json');

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
            return { [mapping]: { not: 'USA' } };
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
            return { [mapping]: '1' };
        case '2nd Round':
            return { [mapping]: '2' };
        case 'Top 10 pick':
            return { draft_number: { lte: '10' } };
        case 'Top 5 pick':
            return { draft_number: { lte: '5' } };
        case 'Top 3 pick':
            return { draft_number: { lte: '3' } };
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
    const totalInches = feet * 12 + inches;
    return { height: { [mapping.operator]: totalInches.toString() } };
}

function constructOneFranchiseCondition(category, mapping) {
    if (mapping.operator === "size") {
        if (category === "Loyal") {
            return { [mapping.field]: { [mapping.operator]: mapping.value } };
        } else if (category === "Journeyman(5+ teams)") {
            return { [mapping.field]: { [mapping.operator]: { gte: mapping.value } } };
        }
    }
    console.error(`Invalid One Franchise category or mapping: ${category}`);
    return {};
}

module.exports = { constructCondition };