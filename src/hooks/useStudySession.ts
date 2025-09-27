import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCardsByCategory } from '../data/flashcards';
import type { Flashcard } from '../data/flashcards';
import { useIncorrectCards } from './useIncorrectCards';
import { useStats } from './useStats';
import { seededShuffle } from '../utils/seededShuffle';

export const useStudySession = (category: string | undefined, seed?: number) => {
  const navigate = useNavigate();
  const { updateIncorrectCards, addIncorrectCard } = useIncorrectCards();
  const { updateCategoryStats } = useStats();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [incorrectCards, setIncorrectCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (category) {
      setIsLoading(true);
      const categoryCards = getCardsByCategory(category);
      const shuffledCards = seededShuffle(categoryCards, seed);
      setCards(shuffledCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionComplete(false);
      setIncorrectCards([]);
      setStats({ correct: 0, incorrect: 0 });
      setIsLoading(false);
    }
  }, [category, seed]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (sessionComplete) return;

    if (isCorrect) {
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      if (category) updateCategoryStats(category, { studied: 1, correct: 1 });
    } else {
      setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      const incorrectCard = cards[currentCardIndex];
      setIncorrectCards((prev) => [...prev, incorrectCard]);
      addIncorrectCard(incorrectCard);
      if (category) updateCategoryStats(category, { studied: 1, incorrect: 1 });
    }

    if (currentCardIndex < cards.length - 1) {
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
        setIsFlipped(false);
      }, 1000); // Show feedback for 1 second
    } else {
      setSessionComplete(true);
    }
  }, [currentCardIndex, cards, sessionComplete, category, updateCategoryStats]);

  const handleReset = () => {
    // Re-shuffle and start over
    const shuffledCards = seededShuffle(cards, seed);
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setIncorrectCards([]);
    setStats({ correct: 0, incorrect: 0 });
  };

  const startRedoSession = (cardsToRedo: Flashcard[]) => {
    updateIncorrectCards(cardsToRedo);
    navigate('/redo');
  };
  
  return {
    cards,
    currentCardIndex,
    isFlipped,
    sessionComplete,
    stats,
    isLoading,
    handleFlip,
    handleAnswer,
    handleReset,
    startRedoSession,
    incorrectCards,
  };
};
