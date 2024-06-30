import React from 'react';

const TicTacToeBoard = () => {
  const categories = [
    "Points > 20",
    "Rookie of the Year",
    "MVP",
    "Teams: Lakers",
    "Height > 6'6\"",
    "Played in 2000s",
  ];

  const grid = Array(3).fill(null).map(() => Array(3).fill(null));

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {categories.slice(0, 3).map((category, index) => (
          <div key={index} className="text-center font-semibold">
            {category}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="w-20 h-20 border-2 flex items-center justify-center text-xl font-bold"
              >
                {/* Placeholder for player moves */}
              </div>
            ))}
            <div className="ml-4 flex flex-col justify-around">
              <div className="font-semibold">{categories[rowIndex + 3]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
