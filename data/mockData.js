// Mock data for TFADHLOON Prediction Game

export const mockQuestions = [
  {
    id: 1,
    en: {
      question: "Would you rather...",
      optionA: "Have the ability to fly but only 3 feet off the ground",
      optionB: "Be invisible but only when nobody is looking at you"
    },
    ar: {
      question: "ايش تفضلون...",
      optionA: "تقدرون تطيرون بس ٣ أقدام من الأرض",
      optionB: "تكونون شفافين بس لما ما حد يشوفكم"
    }
  },
  {
    id: 2,
    en: {
      question: "Would you rather...",
      optionA: "Always have to sing instead of speak",
      optionB: "Always have to dance when you walk"
    },
    ar: {
      question: "ايش تفضلون...",
      optionA: "دايماً تغنون بدل ما تتكلمون",
      optionB: "دايماً ترقصون لما تمشون"
    }
  },
  {
    id: 3,
    en: {
      question: "Would you rather...",
      optionA: "Have pizza for every meal for a year",
      optionB: "Never eat pizza again"
    },
    ar: {
      question: "ايش تفضلون...",
      optionA: "تاكلون بيتزا كل وجبة لسنة كاملة",
      optionB: "ما تاكلون بيتزا أبداً مرة ثانية"
    }
  }
];

export const mockPlayers = [
  { id: 1, name: "Ahmed", avatar: "🎯", isHost: true, score: 0 },
  { id: 2, name: "Sara", avatar: "🎪", isHost: false, score: 0 },
  { id: 3, name: "Omar", avatar: "🎨", isHost: false, score: 0 },
  { id: 4, name: "Layla", avatar: "🎭", isHost: false, score: 0 }
];

export const mockGameState = {
  gameCode: "ABC123",
  currentCycle: 1, // 1, 2, or 3 (total 3 cycles)
  totalCycles: 3,
  currentPlayerTurn: 0, // Index of player whose turn it is
  currentQuestion: 0,
  gamePhase: "waiting", // "waiting", "predicting", "answering", "reveal", "leaderboard", "final"
  players: mockPlayers,
  predictions: [], // Array of {playerId, prediction: 'A' or 'B'}
  currentAnswer: null, // 'A' or 'B'
  roundResults: {
    correctPredictors: [], // Array of player IDs who predicted correctly
    wrongPredictors: [] // Array of player IDs who predicted wrong
  }
};

export const mockScoreboard = [
  { name: "Ahmed", score: 5, matches: "5/6", avatar: "🎯" },
  { name: "Sara", score: 4, matches: "4/6", avatar: "🎪" },
  { name: "Omar", score: 3, matches: "3/6", avatar: "🎨" },
  { name: "Layla", score: 2, matches: "2/6", avatar: "🎭" }
];

// Utility functions
export const generateGameCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const getRandomQuestion = () => {
  return mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
};

export const getCurrentPlayer = (gameState) => {
  return gameState.players[gameState.currentPlayerTurn];
};

export const getOtherPlayers = (gameState) => {
  return gameState.players.filter((_, index) => index !== gameState.currentPlayerTurn);
};

export const calculatePredictionResults = (predictions, actualAnswer) => {
  const correctPredictors = predictions.filter(p => p.prediction === actualAnswer);
  const wrongPredictors = predictions.filter(p => p.prediction !== actualAnswer);
  
  return {
    correctPredictors: correctPredictors.map(p => p.playerId),
    wrongPredictors: wrongPredictors.map(p => p.playerId)
  };
};

export const isGameComplete = (gameState) => {
  // Game is complete when all players have answered 3 times (3 cycles)
  return gameState.currentCycle > 3;
};
