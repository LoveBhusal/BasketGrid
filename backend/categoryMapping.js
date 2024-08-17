const categoryMapping = {
  "Teams": "teams_played_for",
  "Colleges": "school",
  "Accolades": {
    "MVP": { field: "mvp", minValue: 1 },
    "DPOY": { field: "dpoy", minValue: 1 },
    "6MOTY": { field: "smoty", minValue: 1 },
    "ROY": { field: "roy", minValue: 1 },
    "All Star": { field: "all_star", minValue: 1 },
    "FMVP": { field: "finals_mvp", minValue: 1 },
    "All NBA Defense": { field: "all_nba_defense", minValue: 1 },
    "All NBA": { field: "all_nba", minValue: 1 },
    "5+ All NBA": { field: "all_nba", minValue: 5 },
    "7x+ All Star": { field: "all_star", minValue: 7 },
    "3x+ All Star": { field: "all_star", minValue: 3 },
    "3x+ All Defense": { field: "all_nba_defense", minValue: 3 },
    "3+ All NBA": { field: "all_nba", minValue: 3 }
  },
  "Draft": "draft_number",
  "Not USA": "country",
  "Statistics": {
    "PTS > 20": { field: "pts", operator: "gt", value: 20 },
    "PTS > 25": { field: "pts", operator: "gt", value: 25 },
    "PTS < 5": { field: "pts", operator: "lt", value: 5 },
    "REB >= 10": { field: "reb", operator: "gt", value: 10 },
    "AST > 7": { field: "ast", operator: "gt", value: 7 },
    "3PT% > 40": { field: "fg3_pct", operator: "gte", value: .40 },
    "BLK >= 2": { field: "blk", operator: "gte", value: 2 },
    "STL >= 1.5": { field: "stl", operator: "gte", value: 1.5 }
  },
  "ERA": {
    "Played in 80s": { from: 1980, to: 1989 },
    "Played in 90s": { from: 1990, to: 1999 },
    "Played in 2000s": { from: 2000, to: 2009 }
  },
  "Height": {
    "Short Kings": { field: "height", operator: "lte", value: "6-0" },
    "7FT+": { field: "height", operator: "gte", value: "7-0" }
  },
  "One Franchise": {
    "Journeyman(5+ teams)": { field: "team_count", operator: "gte", value: 5 },
    "Loyal": { field: "team_count", operator: "lte", value: 1 }
  } 
};

module.exports = categoryMapping;
