'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import getSocket from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import ResultsUI from './ResultsUI';
import ResultsActions from './ResultsActions';

export default function ResultsMain({ gameCode }) {
  const router = useRouter();
  const [roundResults, setRoundResults] = useState(null);
  const [playerChoices, setPlayerChoices] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [scoreboard, setScoreboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScores, setShowScores] = useState(false);

  // Socket setup
  useEffect(() => {
    if (gameCode) {
      setupSocketConnection();
      fetchRoundResults();
    }
  }, [gameCode]);

  const setupSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('next-round', (data) => {
      showNotification('Next round starting!', 'info', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}/prediction`);
      }, 2000);
    });

    socket.on('game-ended', (data) => {
      showNotification('Game completed!', 'success', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}/final`);
      }, 2000);
    });

    socket.on('scores-updated', (data) => {
      setScoreboard(data.scoreboard || []);
    });

    return () => {
      socket.off('next-round');
      socket.off('game-ended');
      socket.off('scores-updated');
    };
  };

  const fetchRoundResults = async () => {
    try {
      setIsLoading(true);
      const response = await GameAPI.getRoundResults(gameCode);
      
      if (response.success) {
        setRoundResults(response.results);
        setPlayerChoices(response.playerChoices || []);
        setCurrentQuestion(response.question);
        setCorrectAnswer(response.correctAnswer);
        setScoreboard(response.scoreboard || []);
      } else {
        setError(response.message || 'Failed to load results');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Error fetching results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextRound = () => {
    const socket = getSocket();
    socket.emit('start-next-round', { gameCode });
  };

  const handleViewScoreboard = () => {
    setShowScores(!showScores);
  };

  const handleBackToLobby = () => {
    router.push(`/game/${gameCode}`);
  };

  const handleEndGame = () => {
    const socket = getSocket();
    socket.emit('end-game', { gameCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ResultsUI
          roundResults={roundResults}
          playerChoices={playerChoices}
          currentQuestion={currentQuestion}
          correctAnswer={correctAnswer}
          scoreboard={scoreboard}
          isLoading={isLoading}
          error={error}
          showScores={showScores}
        />
        
        <ResultsActions
          onNextRound={handleNextRound}
          onViewScoreboard={handleViewScoreboard}
          onBackToLobby={handleBackToLobby}
          onEndGame={handleEndGame}
          showScores={showScores}
        />
      </div>
    </div>
  );
}
