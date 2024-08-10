import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Title from './Title';
import Footer from './Footer';
import LandingPage from './LandingPage';
import SoloMode from './SoloMode';
import LocalH2HMode from './LocalH2HMode';
import OnlineH2HMode from './OnlineH2HMode';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Title />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/solo" element={<SoloMode />} />
            <Route path="/local-h2h" element={<LocalH2HMode />} />
            <Route path="/online-h2h" element={<OnlineH2HMode />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
