import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategorySelectionPage from './pages/CategorySelectionPage';
import StudySessionPage from './pages/StudySessionPage';
import RedoPage from './pages/RedoPage';
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizPage from './pages/QuizPage';
import StatsPage from './pages/StatsPage';
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
          <Route path="/redo" element={<RedoPage />} />
          <Route path="/quiz" element={<QuizSelectionPage />} />
          <Route path="/quiz/:category" element={<QuizPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
