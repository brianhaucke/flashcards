import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../data/flashcards';

const QuizSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedQuizType, setSelectedQuizType] = useState<string>('');
  
  const categories = getCategories();
  const quizTypes = [
    { id: 'multiple-choice', name: 'Multiple Choice', description: 'Choose the correct answer from 4 options', emoji: '🔘' },
    { id: 'fill-blank', name: 'Fill in the Blank', description: 'Type the English translation', emoji: '✏️' }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#dbeafe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      maxWidth: '40rem',
      width: '100%',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280',
      marginBottom: '2rem'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
      textAlign: 'left' as const
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem'
    },
    optionButton: {
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      textAlign: 'left' as const
    },
    selectedOption: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    quizTypeCard: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left' as const
    },
    selectedQuizType: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4'
    },
    quizTypeTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    quizTypeDescription: {
      fontSize: '0.9rem',
      color: '#6b7280'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      marginTop: '2rem'
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
    disabledButton: {
      backgroundColor: '#d1d5db',
      color: '#9ca3af',
      cursor: 'not-allowed'
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleQuizTypeSelect = (quizType: string) => {
    setSelectedQuizType(quizType);
  };

  const handleStartQuiz = () => {
    if (selectedCategory && selectedQuizType) {
      navigate(`/quiz/${selectedCategory}?type=${selectedQuizType}`);
    }
  };

  const getCategoryDisplayName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'animals': return '🐾';
      case 'food': return '🍎';
      case 'verbs': return '🏃';
      default: return '📚';
    }
  };

  const isStartDisabled = !selectedCategory || !selectedQuizType;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🧠 Quiz Mode
        </h1>
        <p style={styles.subtitle}>
          Choose a category and quiz type to test your Spanish knowledge
        </p>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Select Category</h2>
          <div style={styles.grid}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                style={{
                  ...styles.optionButton,
                  ...(selectedCategory === category ? styles.selectedOption : {})
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {getCategoryEmoji(category)} {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Select Quiz Type</h2>
          <div style={styles.grid}>
            {quizTypes.map((quizType) => (
              <div
                key={quizType.id}
                onClick={() => handleQuizTypeSelect(quizType.id)}
                style={{
                  ...styles.quizTypeCard,
                  ...(selectedQuizType === quizType.id ? styles.selectedQuizType : {})
                }}
                onMouseOver={(e) => {
                  if (selectedQuizType !== quizType.id) {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedQuizType !== quizType.id) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={styles.quizTypeTitle}>
                  <span>{quizType.emoji}</span>
                  <span>{quizType.name}</span>
                </div>
                <div style={styles.quizTypeDescription}>
                  {quizType.description}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.buttonContainer}>
          <button
            onClick={handleStartQuiz}
            disabled={isStartDisabled}
            style={{
              ...styles.button,
              ...(isStartDisabled ? styles.disabledButton : styles.primaryButton)
            }}
          >
            🚀 Start Quiz
          </button>
          
          <button
            onClick={() => navigate('/')}
            style={{...styles.button, ...styles.secondaryButton}}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSelectionPage;
