import React from 'react';
import './LandingPage.css';
import basketballIcon from './basketball.png';
import gridImg from './ttt.png';


const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="hero-text">
        <img src={gridImg} alt="3x3 Grid" className="floating-grid" />
        <h1>Welcome to <span className="highlighted-text">BasketGrid</span></h1>
        
        <img src={basketballIcon} alt="Basketball Icon" className="bouncing-basketball-icon" />
        <p className="game-description">The ultimate basketball-themed strategy game. Challenge yourself in Solo Mode or go head-to-head with a friend!</p>
        <p className="cta-text">Game modes are accessible at the top!</p>
      </div>
      <div className="ball-knowledge-text">
        <h2>DO YOU KNOW BALL?</h2>
      </div>
    </div>
  );
};

export default LandingPage;