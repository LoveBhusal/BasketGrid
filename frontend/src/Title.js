import React, { useState } from 'react';
import './Title.css';

const Title = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="App-header">
      <h1 className="logo-text">BasketGrid</h1>
      <div className="button-group">
        <button className="btn solo-btn">
          <span className="btn-text-one">solo grid</span>
          <span className="btn-text-two">click to play</span>
        </button>
        <button className="btn local-btn">
          <span className="btn-text-one">Local H2H</span>
          <span className="btn-text-two">click to play</span>
        </button>
      </div>
      <button className="about-btn" onClick={toggleModal}>
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front text"> About </span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card">
              <div className="content">
                <p className="heading">About BasketGrid</p>
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
