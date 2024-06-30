import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const TicTacToeGrid = () => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

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

  const closePopup = () => {
    setIsOpen(false);
    setSelectedSquare(null);
    setSearch('');
  };

  return (
    <div className="container">
      <div className="board">
        {Array(9).fill(null).map((_, index) => (
          <div
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {selectedSquare === index ? 'Selected' : ''}
          </div>
        ))}
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
                onClick={() => {
                  console.log(player.player_name);
                  closePopup();
                }}
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
