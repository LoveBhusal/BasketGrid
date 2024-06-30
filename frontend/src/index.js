import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Global styles
import App from './App';  // Main app component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Renders into the 'root' div in your HTML
);
