import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncorrectCards } from '../hooks/useIncorrectCards';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { hasIncorrectCards } = useIncorrectCards();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          🇪🇸 Spanish Flashcards
        </h1>
        <p className={styles.subtitle}>
          Learn Spanish vocabulary with interactive flashcards and quizzes
        </p>
        
        <div className={styles.buttonContainer}>
          <button
            onClick={() => navigate('/study')}
            className={`${styles.button} ${styles.studyButton}`}
          >
            📚 Study Mode
          </button>
          
          <button
            onClick={() => navigate('/quiz')}
            className={`${styles.button} ${styles.quizButton}`}
          >
            🧠 Quiz Mode
          </button>
          
          <button
            onClick={() => navigate('/stats')}
            className={`${styles.button} ${styles.statsButton}`}
          >
            📊 Statistics
          </button>
          
          {hasIncorrectCards && (
            <button
              onClick={() => navigate('/redo')}
              className={`${styles.button} ${styles.redoButton}`}
            >
              🔄 Redo Wrong Cards
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
