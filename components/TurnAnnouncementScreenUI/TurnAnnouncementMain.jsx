'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import { getSocket } from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import TurnAnnouncementUI from './TurnAnnouncementUI';
import TurnAnnouncementActions from './TurnAnnouncementActions';

export default function TurnAnnouncementMain({ gameCode }) {
  const router = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-proceed to prediction screen
      handleStartRound();
    }
  }, [countdown]);

  // Socket setup
  useEffect(() => {
    if (gameCode) {
      setupSocketConnection();
      fetchTurnData();
    }
  }, [gameCode]);
  const setupSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('roundStarted', (data) => {
      setCurrentPlayer(data.currentPlayer);
      setNextQuestion(data.question);
      setCurrentRound(data.roundNumber || 1);
      setTotalRounds(data.totalRounds || 5);
      setIsMyTurn(data.isMyTurn || false);
      setCountdown(5);
    });

    socket.on('gameStarted', () => {
      showNotification('Game starting!', 'info', 2000);
      router.push(`/game/${gameCode}/prediction`);
    });

    socket.on('finalScores', () => {
      router.push(`/game/${gameCode}/final`);
    });

    return () => {
      socket.off('roundStarted');
      socket.off('gameStarted');
      socket.off('finalScores');
    };
  };
  const fetchTurnData = async () => {
    try {
      setIsLoading(true);
      const response = await GameAPI.getGameState(gameCode);
      
      if (response.status === 'success') {
        const gameState = response.data;
        setCurrentPlayer(gameState.currentPlayer);
        setNextQuestion(gameState.currentQuestion);
        setCurrentRound(gameState.currentRound || 1);
        setTotalRounds(gameState.totalRounds || 5);
        setIsMyTurn(gameState.isMyTurn || false);
        setAllPlayers(gameState.players || []);
      } else {
        setError(response.message || 'Failed to load turn data');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Error fetching turn data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRound = () => {
    router.push(`/game/${gameCode}/prediction`);
  };

  const handleSkipCountdown = () => {
    setCountdown(0);
  };

  const handleBackToLobby = () => {
    router.push(`/game/${gameCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <TurnAnnouncementUI
          currentPlayer={currentPlayer}
          nextQuestion={nextQuestion}
          currentRound={currentRound}
          totalRounds={totalRounds}
          isMyTurn={isMyTurn}
          countdown={countdown}
          isLoading={isLoading}
          error={error}
          allPlayers={allPlayers}
        />
        
        <TurnAnnouncementActions
          countdown={countdown}
          isMyTurn={isMyTurn}
          onStartRound={handleStartRound}
          onSkipCountdown={handleSkipCountdown}
          onBackToLobby={handleBackToLobby}
        />
      </div>
    </div>
  );
}
