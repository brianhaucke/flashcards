import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Flashcard } from '../data/flashcards';
import FlashcardComponent from '../components/Flashcard';

const RedoPage: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    // Load incorrect cards from localStorage
    const storedIncorrectCards = localStorage.getItem('incorrectCards');
    if (storedIncorrectCards) {
      const incorrectCards = JSON.parse(storedIncorrectCards);
      setCards(incorrectCards);
    }
  }, []);

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentCard = cards[currentCardIndex];
    
    if (isCorrect) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      // Remove this card from the incorrect cards list
      const updatedCards = cards.filter((_, index) => index !== currentCardIndex);
      setCards(updatedCards);
      // Update localStorage
      localStorage.setItem('incorrectCards', JSON.stringify(updatedCards));
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Hide the answer immediately to prevent flashing
    setIsFlipped(false);

    // Add a small delay before moving to next card
    setTimeout(() => {
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setSessionComplete(true);
      }
    }, 300);
  };

  const handleReset = () => {
    // Clear all incorrect cards from localStorage
    localStorage.removeItem('incorrectCards');
    setCards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setStats({ correct: 0, incorrect: 0 });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#dbeafe',
      padding: '2rem 1rem'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    progress: {
      color: '#6b7280',
      fontSize: '1.1rem',
      marginBottom: '1rem'
    },
    stats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      fontSize: '1rem',
      color: '#374151'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    flashcardContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto 2rem auto'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap' as const,
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    },
    dangerButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    completionCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center' as const,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    },
    completionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    completionStats: {
      fontSize: '1.1rem',
      color: '#6b7280',
      marginBottom: '2rem'
    }
  };

  if (cards.length === 0 && !sessionComplete) {
    return (
      <div style={styles.container}>
        <div style={styles.completionCard}>
          <h2 style={styles.completionTitle}>🎉 No Wrong Cards!</h2>
          <p style={styles.completionStats}>
            You don't have any cards marked as incorrect. Great job!
          </p>
          
          <div style={styles.buttonContainer}>
            <button
              onClick={() => navigate('/study')}
              style={{...styles.button, ...styles.primaryButton}}
            >
              📚 Start Studying
            </button>
            <button
              onClick={() => navigate('/')}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = stats.correct + stats.incorrect > 0 
      ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
      : 0;

    return (
      <div style={styles.container}>
        <div style={styles.completionCard}>
          <h2 style={styles.completionTitle}>🎉 Redo Session Complete!</h2>
          <div style={styles.completionStats}>
            <p>Correct: {stats.correct}</p>
            <p>Incorrect: {stats.incorrect}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>Remaining wrong cards: {cards.length}</p>
          </div>
          
          <div style={styles.buttonContainer}>
            {cards.length > 0 && (
              <button
                onClick={() => {
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                  setSessionComplete(false);
                  setStats({ correct: 0, incorrect: 0 });
                }}
                style={{...styles.button, ...styles.primaryButton}}
              >
                🔄 Continue Redo
              </button>
            )}
            <button
              onClick={handleReset}
              style={{...styles.button, ...styles.dangerButton}}
            >
              🗑️ Clear All Wrong Cards
            </button>
            <button
              onClick={() => navigate('/study')}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              📚 Study New Category
            </button>
            <button
              onClick={() => navigate('/')}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = `${currentCardIndex + 1} of ${cards.length}`;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🔄 Redo Wrong Cards
        </h1>
        <p style={styles.progress}>{progress}</p>
        
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span>✅</span>
            <span>{stats.correct}</span>
          </div>
          <div style={styles.statItem}>
            <span>❌</span>
            <span>{stats.incorrect}</span>
          </div>
        </div>
      </div>

      <div style={styles.flashcardContainer}>
        <FlashcardComponent
          card={currentCard}
          onAnswer={handleAnswer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={handleReset}
          style={{...styles.button, ...styles.dangerButton}}
        >
          🗑️ Clear All Wrong Cards
        </button>
        <button
          onClick={() => navigate('/study')}
          style={{...styles.button, ...styles.secondaryButton}}
        >
          ← Back to Study
        </button>
        <button
          onClick={() => navigate('/')}
          style={{...styles.button, ...styles.secondaryButton}}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default RedoPage;
