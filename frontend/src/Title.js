import React from 'react';
import './Title.css';

const Title = () => {
  return (
    <header className="App-header">
      <h1 className="text-4xl font-bold">BasketGrid</h1>
      <button>
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front text"> About </span>
      </button>
    </header>
  );
};

export default Title;
