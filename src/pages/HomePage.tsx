import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hasIncorrectCards, setHasIncorrectCards] = useState(false);

  useEffect(() => {
    // Check if there are any incorrect cards stored in localStorage
    const incorrectCards = localStorage.getItem('incorrectCards');
    setHasIncorrectCards(incorrectCards ? JSON.parse(incorrectCards).length > 0 : false);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#dbeafe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      maxWidth: '28rem',
      width: '100%',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    subtitle: {
      color: '#6b7280',
      marginBottom: '2rem'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem'
    },
    button: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    studyButton: {
      backgroundColor: '#3b82f6'
    },
    quizButton: {
      backgroundColor: '#10b981'
    },
    statsButton: {
      backgroundColor: '#8b5cf6'
    },
    redoButton: {
      backgroundColor: '#f59e0b'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🇪🇸 Spanish Flashcards
        </h1>
        <p style={styles.subtitle}>
          Learn Spanish vocabulary with interactive flashcards and quizzes
        </p>
        
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate('/study')}
            style={{...styles.button, ...styles.studyButton}}
          >
            📚 Study Mode
          </button>
          
          <button
            onClick={() => navigate('/quiz')}
            style={{...styles.button, ...styles.quizButton}}
          >
            🧠 Quiz Mode
          </button>
          
          <button
            onClick={() => navigate('/stats')}
            style={{...styles.button, ...styles.statsButton}}
          >
            📊 Statistics
          </button>
          
          {hasIncorrectCards && (
            <button
              onClick={() => navigate('/redo')}
              style={{...styles.button, ...styles.redoButton}}
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
