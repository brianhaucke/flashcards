import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategorySelectionPage from './pages/CategorySelectionPage';
import StudySessionPage from './pages/StudySessionPage';
import './App.css';

const placeholderStyle = {
  padding: '2rem',
  textAlign: 'center' as const,
  fontSize: '1.5rem',
  color: '#6b7280'
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<CategorySelectionPage />} />
          <Route path="/study/:category" element={<StudySessionPage />} />
          <Route path="/quiz" element={<div style={placeholderStyle}>Quiz Mode - Coming Soon</div>} />
          <Route path="/stats" element={<div style={placeholderStyle}>Statistics - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
