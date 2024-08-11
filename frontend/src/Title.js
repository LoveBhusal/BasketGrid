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
                <p className="heading">Rules to Play</p>
                <p className="para">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi laboriosam
                  at voluptas minus culpa deserunt delectus sapiente inventore pariatur.
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
