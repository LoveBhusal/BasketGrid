import React from 'react';
import TicTacToeGrid from './TicTacToeGrid';

const SoloMode = () => {
  return (
    <div>
      
      <TicTacToeGrid soloMode={true} />
    </div>
  );
};

export default SoloMode;
