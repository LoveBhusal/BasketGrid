import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="hero-text">
        <h1>Welcome to <span className="highlighted-text">BasketGrid</span></h1>
        <img src="/logo512.png" alt="Basketball Icon" className="bouncing-basketball-icon" />

        <p>The ultimate basketball-themed strategy game. Challenge yourself in Solo Mode or go head-to-head with a friend!</p>
        <p className="cta-text">Game modes are accessible at the top!</p>
      </div>
      <div className="cta-container">
        <button className="about-button">About</button>
      </div>
    </div>
  );
};

export default LandingPage;
