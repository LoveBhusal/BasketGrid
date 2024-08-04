import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const teamLogoMap = {
  "Atlanta Hawks": "hawks.svg",
  "Boston Celtics": "celtics.svg",
  "Brooklyn Nets": "nets.svg",
  "Charlotte Hornets": "hornets.svg",
  "Chicago Bulls": "bulls.svg",
  "Cleveland Cavaliers": "cavaliers.svg",
  "Dallas Mavericks": "mavericks.svg",
  "Denver Nuggets": "nuggets.svg",
  "Detroit Pistons": "pistons.svg",
  "Golden State Warriors": "warriors.svg",
  "Houston Rockets": "rockets.svg",
  "Indiana Pacers": "pacers.svg",
  "Los Angeles Clippers": "clippers.svg",
  "Los Angeles Lakers": "lakers.svg",
  "Memphis Grizzlies": "grizzlies.svg",
  "Miami Heat": "heat.svg",
  "Milwaukee Bucks": "bucks.svg",
  "Minnesota Timberwolves": "timberwolves.svg",
  "New Orleans Pelicans": "pelicans.svg",
  "New York Knicks": "knicks.svg",
  "Oklahoma City Thunder": "thunder.svg",
  "Orlando Magic": "magic.svg",
  "Philadelphia 76ers": "76ers.svg",
  "Phoenix Suns": "suns.svg",
  "Portland Trail Blazers": "trailblazers.svg",
  "Sacramento Kings": "kings.svg",
  "San Antonio Spurs": "spurs.svg",
  "Toronto Raptors": "raptors.svg",
  "Utah Jazz": "jazz.svg",
  "Washington Wizards": "wizards.svg",
};

const collegeLogoMap = {
  "Alabama": "alabama.svg",
  "Arizona": "arizona.svg",
  "Connecticut": "connecticut.svg",
  "Duke": "duke.svg",
  "Gonzaga": "gonzaga.svg",
  "Indiana": "indiana.svg",
  "Kansas": "kansas.svg",
  "Kentucky": "kentucky.svg",
  "Louisville": "louisville.svg",
  "Michigan": "michigan.svg",
  "Michigan State": "michiganstate.svg",
  "North Carolina": "northcarolina.svg",
  "Notre Dame": "notredame.svg",
  "Ohio State": "ohiostate.svg",
  "Texas": "texas.svg",
  "UCLA": "ucla.svg",
  "USC": "usc.svg",
  "Villanova": "villanova.svg",
};

const TicTacToeGrid = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [gameMessage, setGameMessage] = useState("Red player's turn");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      if (search) {
        try {
          const response = await fetch(`http://localhost:5001/players?search=${search}`);
          const data = await response.json();
          setFilteredPlayers(data);
        } catch (error) {
          console.error('Error fetching players:', error);
        }
      } else {
        setFilteredPlayers([]);
      }
    };

    fetchPlayers();
  }, [search]);

  const handleClick = (index) => {
    if (grid[index] || winner) return;
    setSelectedSquare(index);
    setIsOpen(true);
  };

  const generatePlayerImageURL = (playerName) => {
    const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
    const [firstName, lastName] = playerName.split(' ').map(normalizeName);
    const truncatedLastName = lastName.substring(0, 5);
    const truncatedFirstName = firstName.substring(0, 2);
  
    return `https://www.basketball-reference.com/req/202407291/images/headshots/${truncatedLastName}${truncatedFirstName}01.jpg`;
  };

  const handlePlayerClick = async (playerName) => {
    const rowIndex = Math.floor(selectedSquare / 3);
    const colIndex = selectedSquare % 3;

    const category1 = categories[colIndex]; // Top category
    const category2 = categories[rowIndex + 3]; // Side category

    try {
      const response = await fetch('http://localhost:5001/validate-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName, category1, category2 }),
      });
      const result = await response.json();

      if (result.valid) {
        const playerImageURL = generatePlayerImageURL(playerName);
        const newGrid = [...grid];
        newGrid[selectedSquare] = { name: playerName, image: playerImageURL, player: currentPlayer };
        setGrid(newGrid);
        closePopup();
        checkWinner(newGrid);
        switchPlayer();
      } else {
        alert('Invalid player for the selected categories');
        switchPlayer();
      }
    } catch (error) {
      console.error('Error validating player:', error);
    }
  };

  const switchPlayer = () => {
    const nextPlayer = currentPlayer === 'red' ? 'blue' : 'red';
    setCurrentPlayer(nextPlayer);
    setGameMessage(`${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)} player's turn`);
  };

  const checkWinner = (currentGrid) => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentGrid[a] && currentGrid[b] && currentGrid[c] &&
          currentGrid[a].player === currentGrid[b].player &&
          currentGrid[a].player === currentGrid[c].player) {
        setWinner(currentGrid[a].player);
        setGameMessage(`${currentGrid[a].player.charAt(0).toUpperCase() + currentGrid[a].player.slice(1)} player wins!`);
        return;
      }
    }

    if (currentGrid.every(square => square !== null)) {
      setGameMessage("It's a draw!");
    }
  };

  const closePopup = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedSquare(null);
  };

  const renderCategory = (category) => {
    let logoFileName = teamLogoMap[category] || collegeLogoMap[category];
    if (logoFileName) {
      const logoPath = teamLogoMap[category] ? `/logos/${logoFileName}` : `/colleges/${logoFileName}`;
      return <img src={logoPath} alt={category} className="team-logo" />;
    }
    return category;
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="container">
       <div className={`game-info ${currentPlayer}`}>
      <h2>{gameMessage}</h2>
    </div>
      <div className="board-container">
        {categories.length >= 6 && (
          <>
            <div className="categories-top">
              <div className="category-item">{renderCategory(categories[0])}</div>
              <div className="category-item">{renderCategory(categories[1])}</div>
              <div className="category-item">{renderCategory(categories[2])}</div>
            </div>
            <div className="categories-side">
              <div className="category-item">{renderCategory(categories[3])}</div>
              <div className="category-item">{renderCategory(categories[4])}</div>
              <div className="category-item">{renderCategory(categories[5])}</div>
            </div>
          </>
        )}
        <div className="board">
          {grid.map((value, index) => (
            <div
              key={index}
              className={`square ${value ? value.player : ''} ${!value && !winner ? 'hoverable' : ''}`}
              onClick={() => handleClick(index)}
            >
              {value && (
                <>
                  <div>{value.name}</div>
                  <img src={value.image} alt={value.name} className="player-headshot" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="button" onClick={resetGame}>
      <span className="button__text">Restart</span>
      <span className="button__icon">
        <svg className="svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
          <path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z"></path>
          <path d="M0 0h48v48h-48z" fill="none"></path>
        </svg>
      </span>
    </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closePopup}
        contentLabel="Player Search"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="popup-content">
          <button className="close" onClick={closePopup}>&times;</button>
          <h2>Search for Player</h2>
          <input
            type="text"
            placeholder="Search for player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <ul className="player-list">
            {filteredPlayers.map((player, index) => (
              <li
                key={index}
                onClick={() => handlePlayerClick(player.player_name)}
                className="player-item"
              >
                {player.player_name}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default TicTacToeGrid;