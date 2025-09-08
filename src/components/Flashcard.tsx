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
      maxWidth: '300px',
      height: '200px',
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
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center' as const,
      padding: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      wordWrap: 'break-word' as const,
      overflow: 'hidden'
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
      marginTop: '2rem',
      marginBottom: '1rem',
      position: 'relative' as const,
      zIndex: 10,
      width: '100%',
      maxWidth: '300px'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      minWidth: '120px',
      position: 'relative' as const,
      zIndex: 10
    },
    correctButton: {
      backgroundColor: '#10b981'
    },
    incorrectButton: {
      backgroundColor: '#ef4444'
    },
    flipHint: {
      textAlign: 'center' as const,
      color: '#374151',
      fontSize: '1rem',
      marginTop: '2rem',
      marginBottom: '1rem',
      fontWeight: '500',
      backgroundColor: '#f3f4f6',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      position: 'relative' as const,
      zIndex: 10,
      width: '100%',
      maxWidth: '300px'
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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
        <div style={styles.flipHint}>
          Click the card to flip and see the translation
        </div>
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
