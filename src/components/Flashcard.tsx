import React from 'react';
import type { Flashcard as FlashcardType } from '../data/flashcards';

interface FlashcardProps {
  card: FlashcardType;
  onAnswer: (isCorrect: boolean) => void;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onAnswer, isFlipped, onFlip }) => {
  const styles = {
    container: {
      perspective: '1000px',
      width: '100%',
      maxWidth: '400px',
      height: '300px',
      margin: '0 auto'
    },
    card: {
      width: '100%',
      height: '100%',
      position: 'relative' as const,
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 0.6s',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      cursor: 'pointer'
    },
    cardFace: {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden' as const,
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center' as const,
      padding: '2rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    front: {
      backgroundColor: '#3b82f6',
      transform: 'rotateY(0deg)'
    },
    back: {
      backgroundColor: '#10b981',
      transform: 'rotateY(180deg)'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      minWidth: '120px'
    },
    correctButton: {
      backgroundColor: '#10b981'
    },
    incorrectButton: {
      backgroundColor: '#ef4444'
    },
    flipHint: {
      textAlign: 'center' as const,
      color: '#6b7280',
      fontSize: '0.9rem',
      marginTop: '1rem'
    }
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      onFlip();
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect);
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.card} onClick={handleCardClick}>
          <div style={{...styles.cardFace, ...styles.front}}>
            {card.spanish}
          </div>
          <div style={{...styles.cardFace, ...styles.back}}>
            {card.english}
          </div>
        </div>
      </div>
      
      {!isFlipped && (
        <p style={styles.flipHint}>
          Click the card to flip and see the translation
        </p>
      )}
      
      {isFlipped && (
        <div style={styles.buttonContainer}>
          <button
            onClick={() => handleAnswer(true)}
            style={{...styles.button, ...styles.correctButton}}
          >
            ✅ I got it right
          </button>
          <button
            onClick={() => handleAnswer(false)}
            style={{...styles.button, ...styles.incorrectButton}}
          >
            ❌ I got it wrong
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
