import React, { useState, useEffect } from 'react';
import type { Flashcard } from '../data/flashcards';

interface MultipleChoiceQuizProps {
  cards: Flashcard[];
  onComplete: (stats: { correct: number; incorrect: number }) => void;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ cards, onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    if (cards.length > 0) {
      shuffleOptions();
    }
  }, [currentCardIndex, cards]);

  const shuffleOptions = () => {
    const currentCard = cards[currentCardIndex];
    if (currentCard) {
      const options = [...currentCard.quiz.options];
      // Shuffle the options array
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return; // Prevent selection after showing result
    
    setSelectedAnswer(answer);
    const currentCard = cards[currentCardIndex];
    const correct = answer === currentCard.english;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setSelectedAnswer('');
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
    optionsContainer: {
      display: 'grid',
      gap: '1rem',
      marginBottom: '2rem'
    },
    optionButton: {
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '500',
      color: '#374151',
      transition: 'all 0.2s',
      textAlign: 'left' as const
    },
    selectedOption: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    correctOption: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
      color: '#065f46'
    },
    incorrectOption: {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2',
      color: '#991b1b'
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
      backgroundColor: '#3b82f6',
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
        
        <div style={styles.optionsContainer}>
          {shuffledOptions.map((option, index) => {
            let buttonStyle = styles.optionButton;
            
            if (showResult) {
              if (option === currentCard.english) {
                buttonStyle = { ...buttonStyle, ...styles.correctOption };
              } else if (option === selectedAnswer && !isCorrect) {
                buttonStyle = { ...buttonStyle, ...styles.incorrectOption };
              }
            } else if (option === selectedAnswer) {
              buttonStyle = { ...buttonStyle, ...styles.selectedOption };
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                style={buttonStyle}
                disabled={showResult}
                onMouseOver={(e) => {
                  if (!showResult && option !== selectedAnswer) {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }
                }}
                onMouseOut={(e) => {
                  if (!showResult && option !== selectedAnswer) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
        
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

export default MultipleChoiceQuiz;
