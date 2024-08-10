import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TicTacToeGrid from './TicTacToeGrid';

const socket = io('http://localhost:5001'); // Update to match your backend

const OnlineH2HMode = () => {
  const [room, setRoom] = useState(null);
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameMessage, setGameMessage] = useState('Waiting for an opponent...');

  useEffect(() => {
    // Request to find a match
    socket.emit('findMatch');

    // Start game when a match is found
    socket.on('startGame', ({ room, players }) => {
      setRoom(room);
      setIsMyTurn(players[0] === socket.id); // First player gets the first turn
      setGameMessage(isMyTurn ? 'Your turn!' : "Opponent's turn");
    });

    // Update game board when the opponent makes a move
    socket.on('move', (data) => {
      const newGrid = [...grid];
      newGrid[data.index] = { player: data.player };
      setGrid(newGrid);
      setIsMyTurn(data.player !== currentPlayer); // Switch turns
      setGameMessage(isMyTurn ? 'Your turn!' : "Opponent's turn");
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [grid, isMyTurn, currentPlayer]);

  const handleClick = (index) => {
    if (isMyTurn && !grid[index]) {
      const newGrid = [...grid];
      newGrid[index] = { player: currentPlayer };
      setGrid(newGrid);
      socket.emit('move', { room, index, player: currentPlayer }); // Emit the move to the server
      setIsMyTurn(false);
      setGameMessage("Opponent's turn");
    }
  };

  return (
    <div>
      <h2>Online Head-to-Head</h2>
      <p>{gameMessage}</p>
      <TicTacToeGrid grid={grid} handleClick={handleClick} />
    </div>
  );
};

export default OnlineH2HMode;
