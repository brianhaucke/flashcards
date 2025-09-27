import React from 'react';
import type { Flashcard as FlashcardType } from '../data/flashcards';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  card: FlashcardType;
  onAnswer: (isCorrect: boolean) => void;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onAnswer, isFlipped, onFlip }) => {
  const handleCardClick = () => {
    if (!isFlipped) {
      onFlip();
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardContainer}>
        <div 
          className={styles.card} 
          onClick={handleCardClick}
          data-testid="flashcard"
        >
          <div className={`${styles.cardFace} ${styles.front} ${isFlipped ? styles.frontFlipped : ''}`}>
            {card.spanish}
          </div>
          <div className={`${styles.cardFace} ${styles.back} ${isFlipped ? styles.backFlipped : ''}`}>
            {card.english}
          </div>
        </div>
      </div>
      
      {!isFlipped && (
        <div className={styles.flipHint}>
          Click the card to flip and see the translation
        </div>
      )}
      
      {isFlipped && (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => handleAnswer(true)}
            className={`${styles.button} ${styles.correctButton}`}
          >
            ✅ I got it right
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className={`${styles.button} ${styles.incorrectButton}`}
          >
            ❌ I got it wrong
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
