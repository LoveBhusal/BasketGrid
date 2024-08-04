// playerUtils.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPlayersWithOneFranchiseCondition(value) {
  const allPlayers = await prisma.player.findMany({
    select: {
      person_id: true,
      player_name: true,
      teams_played_for: true
    }
  });

  return allPlayers.filter(player => {
    const teamCount = new Set(player.teams_played_for.filter(team => team && team.trim() !== '')).size;
    
    if (value === 'Loyal') {
      return teamCount === 1;
    } else if (value === 'Journeyman(5+ teams)') {
      return teamCount >= 5;
    }
    return false;
  });
}

module.exports = { getPlayersWithOneFranchiseCondition };