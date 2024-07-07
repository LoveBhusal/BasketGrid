import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const TicTacToeGrid = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [grid, setGrid] = useState(Array(9).fill(''));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [categories, setCategories] = useState([]);

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
    setSelectedSquare(index);
    setIsOpen(true);
  };

  const handlePlayerClick = (playerName) => {
    const newGrid = [...grid];
    newGrid[selectedSquare] = playerName;
    setGrid(newGrid);
    closePopup();
  };

  const closePopup = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedSquare(null);
  };

  return (
    <div className="container">
      <div className="board">
        {grid.map((value, index) => (
          <div
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="categories">
        <h3>Categories</h3>
        {categories.map((category, index) => (
          <p key={index}>{category}</p>
        ))}
        <button onClick={fetchCategories}>Refresh Categories</button>
      </div>
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
