import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getCardsByCategory } from '../data/flashcards';
import type { Flashcard } from '../data/flashcards';
import MultipleChoiceQuiz from '../components/MultipleChoiceQuiz';
import FillBlankQuiz from '../components/FillBlankQuiz';

const QuizPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quizType = searchParams.get('type') || 'multiple-choice';
  
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [finalStats, setFinalStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    if (category) {
      const categoryCards = getCardsByCategory(category);
      setCards(categoryCards);
    }
  }, [category]);

  const handleQuizComplete = (stats: { correct: number; incorrect: number }) => {
    setFinalStats(stats);
    setQuizComplete(true);
  };

  const handleRestart = () => {
    setQuizComplete(false);
    setFinalStats({ correct: 0, incorrect: 0 });
  };

  const handleNewQuiz = () => {
    navigate('/quiz');
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
    subtitle: {
      color: '#6b7280',
      fontSize: '1.1rem'
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
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
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
    }
  };

  if (!category || cards.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.completionCard}>
          <h2 style={styles.completionTitle}>Category not found</h2>
          <button
            onClick={() => navigate('/quiz')}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const accuracy = finalStats.correct + finalStats.incorrect > 0 
      ? Math.round((finalStats.correct / (finalStats.correct + finalStats.incorrect)) * 100)
      : 0;

    return (
      <div style={styles.container}>
        <div style={styles.completionCard}>
          <h2 style={styles.completionTitle}>🎉 Quiz Complete!</h2>
          <div style={styles.completionStats}>
            <p>Correct: {finalStats.correct}</p>
            <p>Incorrect: {finalStats.incorrect}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>Total Questions: {cards.length}</p>
          </div>
          
          <div style={styles.buttonContainer}>
            <button
              onClick={handleRestart}
              style={{...styles.button, ...styles.successButton}}
            >
              🔄 Try Again
            </button>
            <button
              onClick={handleNewQuiz}
              style={{...styles.button, ...styles.primaryButton}}
            >
              🧠 New Quiz
            </button>
            <button
              onClick={() => navigate('/study')}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              📚 Study Mode
            </button>
            <button
              onClick={() => navigate('/')}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getQuizTypeDisplayName = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'fill-blank': return 'Fill in the Blank';
      default: return 'Quiz';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🧠 {getQuizTypeDisplayName(quizType)} Quiz
        </h1>
        <p style={styles.subtitle}>
          Category: {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>
      </div>

      {quizType === 'multiple-choice' && (
        <MultipleChoiceQuiz
          cards={cards}
          onComplete={handleQuizComplete}
        />
      )}

      {quizType === 'fill-blank' && (
        <FillBlankQuiz
          cards={cards}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default QuizPage;
