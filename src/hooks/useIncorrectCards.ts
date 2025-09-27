import { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '../data/flashcards';

const INCORRECT_CARDS_KEY = 'incorrectCards';

const getStoredIncorrectCards = (): Flashcard[] => {
  try {
    const stored = localStorage.getItem(INCORRECT_CARDS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to parse incorrectCards from localStorage:', error);
  }
  return [];
};

export const useIncorrectCards = () => {
  const [incorrectCards, setIncorrectCards] = useState<Flashcard[]>([]);
  const [hasIncorrectCards, setHasIncorrectCards] = useState(false);

  useEffect(() => {
    const cards = getStoredIncorrectCards();
    setIncorrectCards(cards);
    setHasIncorrectCards(cards.length > 0);
  }, []);

  const updateIncorrectCards = useCallback((updatedCards: Flashcard[]) => {
    localStorage.setItem(INCORRECT_CARDS_KEY, JSON.stringify(updatedCards));
    setIncorrectCards(updatedCards);
    setHasIncorrectCards(updatedCards.length > 0);
  }, []);

  const addIncorrectCard = useCallback((cardToAdd: Flashcard) => {
    const currentCards = getStoredIncorrectCards();
    // Avoid duplicates
    if (!currentCards.find(card => card.spanish === cardToAdd.spanish)) {
      const updatedCards = [...currentCards, cardToAdd];
      updateIncorrectCards(updatedCards);
    }
  }, [updateIncorrectCards]);
  
  const removeIncorrectCard = useCallback((cardToRemove: Flashcard) => {
    const currentCards = getStoredIncorrectCards();
    const updatedCards = currentCards.filter(card => card.spanish !== cardToRemove.spanish);
    updateIncorrectCards(updatedCards);
  }, [updateIncorrectCards]);

  const clearIncorrectCards = useCallback(() => {
    localStorage.removeItem(INCORRECT_CARDS_KEY);
    setIncorrectCards([]);
    setHasIncorrectCards(false);
  }, []);

  return { 
    incorrectCards, 
    hasIncorrectCards, 
    addIncorrectCard,
    removeIncorrectCard,
    updateIncorrectCards,
    clearIncorrectCards 
  };
};

