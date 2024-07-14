// TicTacToeGrid.js

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
        const newGrid = [...grid];
        newGrid[selectedSquare] = playerName;
        setGrid(newGrid);
        closePopup();
      } else {
        alert('Invalid player for the selected categories');
      }
    } catch (error) {
      console.error('Error validating player:', error);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedSquare(null);
  };

  return (
    <div className="container">
      <div className="board-container">
        {categories.length >= 6 && (
          <>
            <div className="categories-top">
              <div className="category-item">{categories[0]}</div>
              <div className="category-item">{categories[1]}</div>
              <div className="category-item">{categories[2]}</div>
            </div>
            <div className="categories-side">
              <div className="category-item">{categories[3]}</div>
              <div className="category-item">{categories[4]}</div>
              <div className="category-item">{categories[5]}</div>
            </div>
          </>
        )}
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
