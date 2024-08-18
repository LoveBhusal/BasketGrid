import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import basketballIcon from './basketball.png';
import gridImg from './ttt.png';
import vectorBg from './vectorbg.jpg'; // Import the new background image

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="landing-container"
      style={{ 
        backgroundImage: `url(${vectorBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw', 
        height: '100vh', 
        color: 'white',
        textAlign: 'center',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      <div className="landing-wrapper">
        <div className="hero-text">
          <img src={gridImg} alt="3x3 Grid" className="floating-grid" />
          <h1>
            Welcome to <span className="highlighted-text">BasketGrid</span>
          </h1>
          <img src={basketballIcon} alt="Basketball Icon" className="bouncing-basketball-icon" />
          <p className="game-description">
            The ultimate basketball-themed strategy game. Challenge yourself in Solo Mode or go head-to-head with a friend!
          </p>
          <p className="cta-text">Game modes are accessible at the top!</p>
        </div>
        <div className="ball-knowledge-text">
          <h2>DO YOU KNOW BALL?</h2>
        </div>
        <div className="game-mode-buttons">
          <button className="btn solo-btn" onClick={() => navigate('/solo')}>
            <span className="btn-text-one">Solo Grid</span>
            <span className="btn-text-two">Click to Play</span>
          </button>
          <button className="btn local-btn" onClick={() => navigate('/local-h2h')}>
            <span className="btn-text-one">Local H2H</span>
            <span className="btn-text-two">Click to Play</span>
          </button>
          <button className="btn online-btn" onClick={() => navigate('/online-h2h')}>
            <span className="btn-text-one">Online H2H</span>
            <span className="btn-text-two">Click to Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
