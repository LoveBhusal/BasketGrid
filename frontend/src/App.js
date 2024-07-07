import React from 'react';
import Title from './Title';
import TicTacToeGrid from './TicTacToeGrid';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Title />
      <main className="main-content">
        <TicTacToeGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
