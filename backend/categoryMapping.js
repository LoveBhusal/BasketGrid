// categoryMapping.js

const categoryMapping = {
    "Teams": "teams_played_for",
    "Colleges": "school",
    "Accolades": {
      "MVP": "mvp",
      "DPOY": "dpoy",
      "6MOTY": "smoty",
      "ROY": "roy",
      "All Star": "all_star",
      "FMVP": "finals_mvp",
      "All NBA Defense": "all_nba_defense",
      "All NBA": "all_nba",
      "5+ All NBA": "all_nba", // Adjust as necessary
      "7x+ All Star": "all_star", // Adjust as necessary
      "3x+ All Star": "all_star", // Adjust as necessary
      "3x+ All Defense": "all_nba_defense", // Adjust as necessary
      "3+ All NBA": "all_nba" // Adjust as necessary
    },
    "Draft": "draft_round",
    "Not USA": "country",
    "Statistics": {
      "PTS > 20": "pts",
      "PTS > 25": "pts",
      "PTS < 5": "pts",
      "REB > 10": "reb",
      "AST > 7": "ast",
      "3PT% > 40": "fg3_pct",
      "BLK > 2": "blk",
      "STL > 1.5": "stl"
    },
    "ERA": {
      "Played in 80s": ["from_year", "to_year"], // Adjust as necessary
      "Played in 90s": ["from_year", "to_year"], // Adjust as necessary
      "Played in 2000s": ["from_year", "to_year"] // Adjust as necessary
    },
    "Height": "height",
    "One Franchise": "teams_played_for"
  };
  
  module.exports = categoryMapping;
  