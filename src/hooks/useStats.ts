import { useState, useEffect, useCallback } from 'react';

export interface CategoryStats {
  studied: number;
  correct: number;
  incorrect: number;
}

export interface GlobalStats {
  [category: string]: CategoryStats;
}

const STATS_KEY = 'flashcardStats';

const getStoredStats = (): GlobalStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Basic validation
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to parse stats from localStorage:', error);
  }
  return {};
};

export const useStats = () => {
  const [stats, setStats] = useState<GlobalStats>(getStoredStats());

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  const updateCategoryStats = useCallback((
    category: string, 
    newStats: Partial<CategoryStats>
  ) => {
    setStats(prevStats => {
      const currentCategoryStats = prevStats[category] || { studied: 0, correct: 0, incorrect: 0 };
      const updatedCategoryStats: CategoryStats = {
        studied: (currentCategoryStats.studied || 0) + (newStats.studied || 0),
        correct: (currentCategoryStats.correct || 0) + (newStats.correct || 0),
        incorrect: (currentCategoryStats.incorrect || 0) + (newStats.incorrect || 0),
      };
      return {
        ...prevStats,
        [category]: updatedCategoryStats,
      };
    });
  }, []);
  
  const resetStats = useCallback(() => {
    setStats({});
    localStorage.removeItem(STATS_KEY);
  }, []);

  return { stats, updateCategoryStats, resetStats };
};
