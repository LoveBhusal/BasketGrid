import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Title.css';

const Title = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="App-header">
      <h1 className="logo-text" onClick={() => navigate('/')}>BasketGrid</h1>
      <div className="button-group">
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
      <button className="about-btn" onClick={toggleModal}>
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front text"> Rules </span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card">
              <div className="content">
                <p className="heading">How to Play</p>

                <p className="important-note">
                        <strong>Important:</strong> In this game, player statistics and achievements are considered across their entire career. This means that a player may be used to match different categories on the grid, even if the achievement or accolade was not earned while they were with the specific team listed. For example, a player who won an MVP award while with one team can still be used to fulfill a category involving a different team they played for during their career.
                    </p>

                    <p className="sub-heading">Solo Mode</p>
                    <p className="para">
                        In Solo Mode, the goal is to fill the entire 3x3 grid by selecting NBA players that match the categories corresponding to each row and column. Choose wisely to ensure that each player satisfies both criteria and complete the grid.
                    </p>

                    <p className="sub-heading">Local H2H</p>
                    <p className="para">
                        In Local H2H mode, two players take turns filling the grid. The objective is to match players with the corresponding row and column categories. The first player to complete a three-in-a-row combination wins the game.
                    </p>

                    <p className="sub-heading">Online H2H</p>
                    <p className="para">
                        Online H2H mode follows the same rules as Local H2H, but allows you to compete with players from around the world. Aim to fill three squares in a row before your opponent to claim victory.
                    </p>

              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Title;
