'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import getSocket from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import ScoreboardUI from './ScoreboardUI';
import ScoreboardActions from './ScoreboardActions';

export default function ScoreboardMain({ gameCode }) {
  const router = useRouter();
  const [scoreboard, setScoreboard] = useState([]);
  const [gameStats, setGameStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Socket setup
  useEffect(() => {
    if (gameCode) {
      setupSocketConnection();
      fetchScoreboard();
    }
  }, [gameCode]);

  const setupSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('scoreboard-updated', (data) => {
      setScoreboard(data.scoreboard || []);
      setGameStats(data.stats);
      setCurrentRound(data.currentRound || 1);
      setTotalRounds(data.totalRounds || 5);
    });

    socket.on('next-round', (data) => {
      showNotification('Next round starting!', 'info', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}/prediction`);
      }, 2000);
    });

    socket.on('game-ended', (data) => {
      setIsGameComplete(true);
      showNotification('Game completed!', 'success', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}/final`);
      }, 3000);
    });

    return () => {
      socket.off('scoreboard-updated');
      socket.off('next-round');
      socket.off('game-ended');
    };
  };

  const fetchScoreboard = async () => {
    try {
      setIsLoading(true);
      const response = await GameAPI.getScoreboard(gameCode);
      
      if (response.success) {
        setScoreboard(response.scoreboard || []);
        setGameStats(response.stats);
        setCurrentRound(response.currentRound || 1);
        setTotalRounds(response.totalRounds || 5);
        setIsGameComplete(response.isComplete || false);
      } else {
        setError(response.message || 'Failed to load scoreboard');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Error fetching scoreboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextRound = () => {
    const socket = getSocket();
    socket.emit('start-next-round', { gameCode });
  };

  const handleViewResults = () => {
    router.push(`/game/${gameCode}/results`);
  };

  const handleBackToLobby = () => {
    router.push(`/game/${gameCode}`);
  };

  const handleEndGame = () => {
    const socket = getSocket();
    socket.emit('end-game', { gameCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ScoreboardUI
          scoreboard={scoreboard}
          gameStats={gameStats}
          isLoading={isLoading}
          error={error}
          currentRound={currentRound}
          totalRounds={totalRounds}
          isGameComplete={isGameComplete}
        />
        
        <ScoreboardActions
          onNextRound={handleNextRound}
          onViewResults={handleViewResults}
          onBackToLobby={handleBackToLobby}
          onEndGame={handleEndGame}
          currentRound={currentRound}
          totalRounds={totalRounds}
          isGameComplete={isGameComplete}
        />
      </div>
    </div>
  );
}
