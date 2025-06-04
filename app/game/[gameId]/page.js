'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// Import all game screens
import TurnAnnouncementScreen from '@/components/GameScreens/TurnAnnouncementScreen';
import PredictionScreen from '@/components/GameScreens/PredictionScreen';
import ResultsScreen from '@/components/GameScreens/ResultsScreen';
import ScoreboardScreen from '@/components/GameScreens/ScoreboardScreen';
import FinalScreen from '@/components/GameScreens/FinalScreen';

// Import mock data
import { mockGameState, mockPlayers } from '@/data/mockData';

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId;
  
  // Game state management
  const [gameState, setGameState] = useState({
    ...mockGameState,
    gameCode: gameId,
    gamePhase: 'playerTurn' // 'playerTurn', 'predicting', 'result', 'leaderboard', 'final'
  });
  
  // Mock current player ID (in real app, this would come from user session)
  const [currentPlayerId] = useState(1);

  const handleStartPredictions = () => {
    setGameState(prev => ({ ...prev, gamePhase: 'predicting' }));
  };

  const handlePredictionSubmit = (prediction, isActualAnswer) => {
    if (isActualAnswer) {
      // Current player submitted their answer
      setGameState(prev => ({ 
        ...prev, 
        currentAnswer: prediction,
        gamePhase: 'result' 
      }));
    } else {
      // Other player submitted prediction
      console.log('Prediction submitted:', prediction);
      // In real app, collect all predictions before moving to answer phase
    }
  };

  const handleNextRound = () => {
    const nextPlayerTurn = (gameState.currentPlayerTurn + 1) % gameState.players.length;
    
    if (nextPlayerTurn === 0) {
      // Completed a full cycle
      if (gameState.currentCycle >= 3) {
        // Game finished after 3 cycles
        setGameState(prev => ({ ...prev, gamePhase: 'final' }));
      } else {
        // Show leaderboard before next cycle
        setGameState(prev => ({ ...prev, gamePhase: 'leaderboard' }));
      }
    } else {
      // Next player's turn
      setGameState(prev => ({ 
        ...prev, 
        currentPlayerTurn: nextPlayerTurn,
        gamePhase: 'playerTurn' 
      }));
    }
  };

  const handleNextCycle = () => {
    setGameState(prev => ({ 
      ...prev, 
      currentCycle: prev.currentCycle + 1,
      currentPlayerTurn: 0,
      gamePhase: 'playerTurn' 
    }));
  };

  const renderGameScreen = () => {
    switch (gameState.gamePhase) {      case 'playerTurn':
        return (
          <TurnAnnouncementScreen 
            gameState={gameState}
            onStartPredictions={handleStartPredictions}
          />
        );
      
      case 'predicting':
        return (
          <PredictionScreen 
            gameState={gameState}
            currentPlayerId={currentPlayerId}
            onPredictionSubmit={handlePredictionSubmit}
          />
        );
        case 'result':
        return (
          <ResultsScreen 
            gameState={gameState}
            onNext={handleNextRound}
          />
        );
      
      case 'leaderboard':
        return (
          <ScoreboardScreen 
            gameState={gameState}
            onNextCycle={handleNextCycle}
          />
        );
      
      case 'final':
        return (
          <FinalScreen 
            gameId={gameId}
            gameState={gameState}
          />
        );
        default:
        return (
          <TurnAnnouncementScreen 
            gameState={gameState}
            onStartPredictions={handleStartPredictions}
          />
        );
    }
  };
  
  return renderGameScreen();
}
