import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardComponent from '../components/Flashcard';
import { useIncorrectCards } from '../hooks/useIncorrectCards';
import styles from './RedoPage.module.css';

const RedoPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    incorrectCards, 
    removeIncorrectCard, 
    clearIncorrectCards 
  } = useIncorrectCards();
  
  const [cards, setCards] = useState(incorrectCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    setCards(incorrectCards);
  }, [incorrectCards]);

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const currentCard = cards[currentCardIndex];
    
    if (isCorrect) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      // Remove this card from the incorrect cards list via the hook
      removeIncorrectCard(currentCard);
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Hide the answer immediately to prevent flashing
    setIsFlipped(false);

    // Add a small delay before moving to next card
    setTimeout(() => {
      // Check if there are any cards left after removing the current one
      const remainingCards = cards.filter((_, index) => index !== currentCardIndex);
      if (remainingCards.length > 0) {
        // If we're not on the last card, move to next
        if (currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
        } else {
          // If we're on the last card, move to the previous one
          setCurrentCardIndex(prev => prev - 1);
        }
      } else {
        // No cards left, complete the session
        setSessionComplete(true);
      }
    }, 300);
  };

  const handleReset = () => {
    // Clear all incorrect cards from localStorage via the hook
    clearIncorrectCards();
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setStats({ correct: 0, incorrect: 0 });
  };

  if (cards.length === 0 && !sessionComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.completionCard}>
          <h2 className={styles.completionTitle}>🎉 No Wrong Cards!</h2>
          <p className={styles.completionStats}>
            You don't have any cards marked as incorrect. Great job!
          </p>
          
          <div className={styles.buttonContainer}>
            <button
              onClick={() => navigate('/study')}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              📚 Start Studying
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${styles.button} ${styles.secondaryButton}`}
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
      <div className={styles.container}>
        <div className={styles.completionCard}>
          <h2 className={styles.completionTitle}>🎉 Redo Session Complete!</h2>
          <div className={styles.completionStats}>
            <p>Correct: {stats.correct}</p>
            <p>Incorrect: {stats.incorrect}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>Remaining wrong cards: {cards.length}</p>
          </div>
          
          <div className={styles.buttonContainer}>
            {cards.length > 0 && (
              <button
                onClick={() => {
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                  setSessionComplete(false);
                  setStats({ correct: 0, incorrect: 0 });
                }}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                🔄 Continue Redo
              </button>
            )}
            <button
              onClick={handleReset}
              className={`${styles.button} ${styles.dangerButton}`}
            >
              🗑️ Clear All Wrong Cards
            </button>
            <button
              onClick={() => navigate('/study')}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              📚 Study New Category
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  
  // Safety check - if currentCard doesn't exist, complete the session
  if (!currentCard) {
    setSessionComplete(true);
    return null; // or return a loading state
  }
  
  const progress = `${currentCardIndex + 1} of ${cards.length}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          🔄 Redo Wrong Cards
        </h1>
        <p className={styles.progress}>{progress}</p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>✅</span>
            <span>{stats.correct}</span>
          </div>
          <div className={styles.statItem}>
            <span>❌</span>
            <span>{stats.incorrect}</span>
          </div>
        </div>
      </div>

      <div className={styles.flashcardContainer}>
        <FlashcardComponent
          card={currentCard}
          onAnswer={handleAnswer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleReset}
          className={`${styles.button} ${styles.dangerButton}`}
        >
          🗑️ Clear All Wrong Cards
        </button>
        <button
          onClick={() => navigate('/study')}
          className={`${styles.button} ${styles.secondaryButton}`}
        >
          ← Back to Study
        </button>
        <button
          onClick={() => navigate('/')}
          className={`${styles.button} ${styles.secondaryButton}`}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default RedoPage;
