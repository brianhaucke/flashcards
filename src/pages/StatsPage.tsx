import React from 'react';
import { useStats } from '../hooks/useStats';
import { useNavigate } from 'react-router-dom';

const StatsPage: React.FC = () => {
  const { stats, resetStats } = useStats();
  const navigate = useNavigate();

  const categories = Object.keys(stats);
  const totalStudied = Object.values(stats).reduce((acc, current) => acc + current.studied, 0);
  const totalCorrect = Object.values(stats).reduce((acc, current) => acc + current.correct, 0);
  const totalIncorrect = Object.values(stats).reduce((acc, current) => acc + current.incorrect, 0);
  const totalAccuracy = totalStudied > 0 ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) : 0;

  const styles = {
    container: { fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' },
    header: { textAlign: 'center' as const, marginBottom: '2rem' },
    title: { fontSize: '2.5rem', marginBottom: '0.5rem' },
    summary: { display: 'flex', justifyContent: 'space-around', background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' },
    summaryItem: { textAlign: 'center' as const },
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
    categoryCard: { border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', background: '#fff' },
    categoryTitle: { fontSize: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' },
    stat: { marginBottom: '0.5rem' },
    buttonContainer: { textAlign: 'center' as const, marginTop: '2rem' },
    button: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' },
    resetButton: { background: '#ef4444', color: 'white' },
    homeButton: { background: '#3b82f6', color: 'white' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Statistics</h1>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <h3>Total Studied</h3>
          <p>{totalStudied}</p>
        </div>
        <div style={styles.summaryItem}>
          <h3>Total Correct</h3>
          <p>{totalCorrect}</p>
        </div>
        <div style={styles.summaryItem}>
          <h3>Total Incorrect</h3>
          <p>{totalIncorrect}</p>
        </div>
        <div style={styles.summaryItem}>
          <h3>Overall Accuracy</h3>
          <p>{totalAccuracy}%</p>
        </div>
      </div>

      <div style={styles.categoryGrid}>
        {categories.length > 0 ? (
          categories.map(category => {
            const categoryStats = stats[category];
            const accuracy = categoryStats.correct + categoryStats.incorrect > 0
              ? Math.round((categoryStats.correct / (categoryStats.correct + categoryStats.incorrect)) * 100)
              : 0;
            return (
              <div key={category} style={styles.categoryCard}>
                <h2 style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <p style={styles.stat}><strong>Studied:</strong> {categoryStats.studied}</p>
                <p style={styles.stat}><strong>Correct:</strong> {categoryStats.correct}</p>
                <p style={styles.stat}><strong>Incorrect:</strong> {categoryStats.incorrect}</p>
                <p style={styles.stat}><strong>Accuracy:</strong> {accuracy}%</p>
              </div>
            );
          })
        ) : (
          <p>No stats yet. Complete a study or quiz session to see your progress!</p>
        )}
      </div>
      
      <div style={styles.buttonContainer}>
        <button onClick={resetStats} style={{...styles.button, ...styles.resetButton}}>Reset All Stats</button>
        <button onClick={() => navigate('/')} style={{...styles.button, ...styles.homeButton}}>Back to Home</button>
      </div>
    </div>
  );
};

export default StatsPage;
