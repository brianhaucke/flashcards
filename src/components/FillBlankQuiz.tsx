import React, { useState } from 'react';
import type { Flashcard } from '../data/flashcards';

interface FillBlankQuizProps {
  cards: Flashcard[];
  onComplete: (stats: { correct: number; incorrect: number }) => void;
}

const FillBlankQuiz: React.FC<FillBlankQuizProps> = ({ cards, onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  const handleAnswerSubmit = () => {
    if (showResult || !userAnswer.trim()) return;
    
    const currentCard = cards[currentCardIndex];
    const correct = userAnswer.trim().toLowerCase() === currentCard.english.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult && userAnswer.trim()) {
      handleAnswerSubmit();
    }
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
    } else {
      onComplete(stats);
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1rem'
    },
    questionCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      textAlign: 'center' as const
    },
    question: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    progress: {
      fontSize: '1rem',
      color: '#6b7280',
      marginBottom: '2rem'
    },
    inputContainer: {
      marginBottom: '2rem'
    },
    input: {
      width: '100%',
      padding: '1rem',
      fontSize: '1.25rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      textAlign: 'center' as const,
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    focusedInput: {
      borderColor: '#3b82f6'
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    disabledButton: {
      backgroundColor: '#d1d5db',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    resultMessage: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      padding: '1rem',
      borderRadius: '0.5rem'
    },
    correctResult: {
      color: '#065f46',
      backgroundColor: '#f0fdf4',
      border: '1px solid #10b981'
    },
    incorrectResult: {
      color: '#991b1b',
      backgroundColor: '#fef2f2',
      border: '1px solid #ef4444'
    },
    nextButton: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      backgroundColor: '#10b981',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem'
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
    hint: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginTop: '0.5rem'
    }
  };

  if (cards.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.questionCard}>
          <h2>No cards available for quiz</h2>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = `${currentCardIndex + 1} of ${cards.length}`;

  return (
    <div style={styles.container}>
      <div style={styles.questionCard}>
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
        
        <p style={styles.progress}>{progress}</p>
        
        <h2 style={styles.question}>
          What does "{currentCard.spanish}" mean?
        </h2>
        
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            disabled={showResult}
            style={{
              ...styles.input,
              ...(userAnswer && !showResult ? styles.focusedInput : {})
            }}
            autoFocus
          />
          <div style={styles.hint}>
            Press Enter to submit your answer
          </div>
        </div>
        
        {!showResult && (
          <button
            onClick={handleAnswerSubmit}
            disabled={!userAnswer.trim()}
            style={{
              ...styles.submitButton,
              ...(!userAnswer.trim() ? styles.disabledButton : {})
            }}
          >
            Submit Answer
          </button>
        )}
        
        {showResult && (
          <div style={{
            ...styles.resultMessage,
            ...(isCorrect ? styles.correctResult : styles.incorrectResult)
          }}>
            {isCorrect ? '✅ Correct!' : `❌ Incorrect. The answer is: ${currentCard.english}`}
          </div>
        )}
        
        {showResult && (
          <button
            onClick={handleNext}
            style={styles.nextButton}
          >
            {currentCardIndex < cards.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FillBlankQuiz;
