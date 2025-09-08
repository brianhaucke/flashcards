import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCategories } from '../data/flashcards';

const CategorySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode') || 'study';
  
  const categories = getCategories();

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
      maxWidth: '32rem',
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
    categoryContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    categoryButton: {
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#374151'
    },
    backButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: '2px solid #6b7280',
      backgroundColor: 'white',
      color: '#6b7280',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem'
    }
  };

  const handleCategorySelect = (category: string) => {
    if (mode === 'study') {
      navigate(`/study/${category}`);
    } else if (mode === 'quiz') {
      navigate(`/quiz/${category}`);
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === 'study' ? '📚' : '🧠'} Choose a Category
        </h1>
        <p style={styles.subtitle}>
          Select a category to {mode === 'study' ? 'study' : 'quiz'} Spanish vocabulary
        </p>
        
        <div style={styles.categoryContainer}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              style={styles.categoryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {getCategoryEmoji(category)} {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => navigate('/')}
          style={styles.backButton}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default CategorySelectionPage;
