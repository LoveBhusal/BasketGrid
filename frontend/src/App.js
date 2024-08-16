import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Title from './Title';
import Footer from './Footer';
import LandingPage from './LandingPage';
import SoloMode from './SoloMode';
import LocalH2HMode from './LocalH2HMode';
import './App.css';

// Utility function to detect mobile devices
const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

// Component to show when the application is accessed on a mobile device
const IncompatibleDevice = () => {
  return (
    <div className="incompatible-device">
      <h2>Sorry, this application is not compatible with mobile devices yet.</h2>
      <p>Please try accessing it on a desktop or laptop for the best experience.</p>
    </div>
  );
};

// Existing "Coming Soon" component
const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <h2 className="coming-soon-title">Online H2H Mode</h2>
      <p className="coming-soon-text">Coming Soon! Sorry for the inconvenience</p>
    </div>
  );
};

function App() {
  // Check if the device is mobile
  if (isMobileDevice()) {
    return <IncompatibleDevice />;
  }

  return (
    <Router>
      <div className="App">
        <Title />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/solo" element={<SoloMode />} />
            <Route path="/local-h2h" element={<LocalH2HMode />} />
            <Route path="/online-h2h" element={<ComingSoon />} /> {/* Updated Route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
