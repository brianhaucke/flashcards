export interface Flashcard {
  category: "animals" | "food" | "verbs";
  spanish: string;
  english: string;
  quiz: {
    type: "multiple-choice";
    options: string[];
  };
}

export const flashcards: Flashcard[] = [
  // Animals
  {
    category: "animals",
    spanish: "el gato",
    english: "the cat",
    quiz: {
      type: "multiple-choice",
      options: ["the dog", "the house", "the cat", "the bird"]
    }
  },
  {
    category: "animals",
    spanish: "el perro",
    english: "the dog",
    quiz: {
      type: "multiple-choice",
      options: ["the cat", "the dog", "the fish", "the horse"]
    }
  },
  {
    category: "animals",
    spanish: "el pájaro",
    english: "the bird",
    quiz: {
      type: "multiple-choice",
      options: ["the bird", "the fish", "the cow", "the pig"]
    }
  },
  {
    category: "animals",
    spanish: "el pez",
    english: "the fish",
    quiz: {
      type: "multiple-choice",
      options: ["the fish", "the bird", "the cat", "the dog"]
    }
  },
  {
    category: "animals",
    spanish: "el caballo",
    english: "the horse",
    quiz: {
      type: "multiple-choice",
      options: ["the horse", "the cow", "the pig", "the sheep"]
    }
  },

  // Food
  {
    category: "food",
    spanish: "la manzana",
    english: "the apple",
    quiz: {
      type: "multiple-choice",
      options: ["the apple", "the orange", "the banana", "the grape"]
    }
  },
  {
    category: "food",
    spanish: "el pan",
    english: "the bread",
    quiz: {
      type: "multiple-choice",
      options: ["the bread", "the rice", "the pasta", "the cake"]
    }
  },
  {
    category: "food",
    spanish: "la leche",
    english: "the milk",
    quiz: {
      type: "multiple-choice",
      options: ["the milk", "the water", "the juice", "the coffee"]
    }
  },
  {
    category: "food",
    spanish: "el arroz",
    english: "the rice",
    quiz: {
      type: "multiple-choice",
      options: ["the rice", "the bread", "the pasta", "the potato"]
    }
  },
  {
    category: "food",
    spanish: "la carne",
    english: "the meat",
    quiz: {
      type: "multiple-choice",
      options: ["the meat", "the fish", "the chicken", "the beef"]
    }
  },

  // Verbs
  {
    category: "verbs",
    spanish: "comer",
    english: "to eat",
    quiz: {
      type: "multiple-choice",
      options: ["to eat", "to drink", "to sleep", "to run"]
    }
  },
  {
    category: "verbs",
    spanish: "beber",
    english: "to drink",
    quiz: {
      type: "multiple-choice",
      options: ["to drink", "to eat", "to sleep", "to walk"]
    }
  },
  {
    category: "verbs",
    spanish: "dormir",
    english: "to sleep",
    quiz: {
      type: "multiple-choice",
      options: ["to sleep", "to eat", "to run", "to walk"]
    }
  },
  {
    category: "verbs",
    spanish: "caminar",
    english: "to walk",
    quiz: {
      type: "multiple-choice",
      options: ["to walk", "to run", "to jump", "to dance"]
    }
  },
  {
    category: "verbs",
    spanish: "correr",
    english: "to run",
    quiz: {
      type: "multiple-choice",
      options: ["to run", "to walk", "to jump", "to dance"]
    }
  }
];

export const getCardsByCategory = (category: string): Flashcard[] => {
  return flashcards.filter(card => card.category === category);
};

export const getCategories = (): string[] => {
  return Array.from(new Set(flashcards.map(card => card.category)));
};
