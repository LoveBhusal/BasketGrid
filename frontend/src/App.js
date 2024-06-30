import React from 'react';
import Title from './Title';
import TicTacToeGrid from './TicTacToeGrid';
import TicTacToeBoard from './TicTacToeBoard'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Title />
      </header>
      <main>
        <TicTacToeGrid />
        <TicTacToeBoard />
      </main>
    </div>
  );
}

export default App;
