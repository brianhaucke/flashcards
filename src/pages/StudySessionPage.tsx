import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardsByCategory, Flashcard } from '../data/flashcards';
import Flashcard from '../components/Flashcard';

const StudySessionPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [incorrectCards, setIncorrectCards] = useState<Flashcard[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    if (category) {
      const categoryCards = getCardsByCategory(category);
      setCards(categoryCards);
    }
  }, [category]);

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentCard = cards[currentCardIndex];
    
    if (isCorrect) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setIncorrectCards(prev => [...prev, currentCard]);
    }

    // Move to next card or complete session
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRedoIncorrect = () => {
    if (incorrectCards.length > 0) {
      setCards(incorrectCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionComplete(false);
      setStats({ correct: 0, incorrect: 0 });
    }
  };

  const handleReset = () => {
    if (category) {
      const categoryCards = getCardsByCategory(category);
      setCards(categoryCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionComplete(false);
      setIncorrectCards([]);
      setStats({ correct: 0, incorrect: 0 });
    }
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
      marginBottom: '2rem'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap' as const
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
    successButton: {
      backgroundColor: '#10b981',
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

  if (!category || cards.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.completionCard}>
          <h2 style={styles.completionTitle}>Category not found</h2>
          <button
            onClick={() => navigate('/study')}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Back to Categories
          </button>
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
          <h2 style={styles.completionTitle}>🎉 Study Session Complete!</h2>
          <div style={styles.completionStats}>
            <p>Correct: {stats.correct}</p>
            <p>Incorrect: {stats.incorrect}</p>
            <p>Accuracy: {accuracy}%</p>
            {incorrectCards.length > 0 && (
              <p>Cards to review: {incorrectCards.length}</p>
            )}
          </div>
          
          <div style={styles.buttonContainer}>
            {incorrectCards.length > 0 && (
              <button
                onClick={handleRedoIncorrect}
                style={{...styles.button, ...styles.successButton}}
              >
                🔄 Redo Wrong Cards ({incorrectCards.length})
              </button>
            )}
            <button
              onClick={handleReset}
              style={{...styles.button, ...styles.primaryButton}}
            >
              🔄 Study Again
            </button>
            <button
              onClick={() => navigate('/study')}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              📚 Choose Another Category
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
          📚 Studying: {category.charAt(0).toUpperCase() + category.slice(1)}
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
        <Flashcard
          card={currentCard}
          onAnswer={handleAnswer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => navigate('/study')}
          style={{...styles.button, ...styles.secondaryButton}}
        >
          ← Back to Categories
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

export default StudySessionPage;
