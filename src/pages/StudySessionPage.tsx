import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlashcardComponent from '../components/Flashcard';
import { useIncorrectCards } from '../hooks/useIncorrectCards';
import styles from './StudySessionPage.module.css';
import { useStudySession } from '../hooks/useStudySession';

const StudySessionPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { 
    cards,
    currentCardIndex,
    isFlipped,
    sessionComplete,
    stats,
    handleFlip,
    handleAnswer,
    handleReset,
    startRedoSession,
    incorrectCards,
  } = useStudySession(category);

  const handleRedoIncorrect = () => {
    if (incorrectCards.length > 0) {
      startRedoSession(incorrectCards);
    }
  };

  if (!category || cards.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.completionCard}>
          <h2 className={styles.completionTitle}>Category not found</h2>
          <button
            onClick={() => navigate('/study')}
            className={`${styles.button} ${styles.primaryButton}`}
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
      <div className={styles.container}>
        <div className={styles.completionCard}>
          <h2 className={styles.completionTitle}>🎉 Study Session Complete!</h2>
          <div className={styles.completionStats}>
            <p>Correct: {stats.correct}</p>
            <p>Incorrect: {stats.incorrect}</p>
            <p>Accuracy: {accuracy}%</p>
            {incorrectCards.length > 0 && (
              <p>Cards to review: {incorrectCards.length}</p>
            )}
          </div>
          
          <div className={styles.buttonContainer}>
            {incorrectCards.length > 0 && (
              <button
                onClick={handleRedoIncorrect}
                className={`${styles.button} ${styles.successButton}`}
              >
                🔄 Redo Wrong Cards ({incorrectCards.length})
              </button>
            )}
            <button
              onClick={handleReset}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              🔄 Study Again
            </button>
            <button
              onClick={() => navigate('/study')}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              📚 Choose Another Category
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
  const progress = `${currentCardIndex + 1} of ${cards.length}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          📚 Studying: {category.charAt(0).toUpperCase() + category.slice(1)}
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
          key={`${currentCard.spanish}-${currentCardIndex}`}
          card={currentCard}
          onAnswer={handleAnswer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={() => navigate('/study')}
          className={`${styles.button} ${styles.secondaryButton}`}
        >
          ← Back to Categories
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

export default StudySessionPage;
