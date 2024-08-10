import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>BasketGrid</h1>
      <div className="scoreboard">
        <span>Pick Your Game Mode Above!</span>
      </div>
      <img src="/path-to-your-basketball-icon.png" alt="Basketball Icon" className="basketball-icon" />
    </div>
  );
};

export default LandingPage;
