'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import { getSocket } from '@/app/services/socket';
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
    
    socket.on('roundStarted', (data) => {
      showNotification('Next round starting!', 'info', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}/prediction`);
      }, 2000);
    });

    socket.on('finalScores', (data) => {
      showNotification('Game completed!', 'success', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}/final`);
      }, 2000);
    });

    socket.on('roundResults', (data) => {
      setRoundResults(data.results);
      setPlayerChoices(data.playerAnswers || []);
      setCurrentQuestion(data.question);
      setCorrectAnswer(data.correctAnswer);
      setScoreboard(data.scoreboard || []);
    });

    return () => {
      socket.off('roundStarted');
      socket.off('finalScores');
      socket.off('roundResults');
    };
  };
  const fetchRoundResults = async () => {
    try {
      setIsLoading(true);
      // Use getLeaderboard as we don't have a specific getRoundResults endpoint
      const response = await GameAPI.getLeaderboard(gameCode);
      
      if (response.status === 'success') {
        setScoreboard(response.data.leaderboard || []);
        // We'll get detailed results from socket events
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
  const handleNextRound = async () => {
    try {
      // Use the API to complete scoring which will trigger next round
      const response = await GameAPI.completeScoring(gameCode);
      if (response.status === 'success') {
        showNotification('Moving to next round...', 'success', 2000);
      }
    } catch (err) {
      console.error('Error completing scoring:', err);
    }
  };

  const handleViewScoreboard = () => {
    setShowScores(!showScores);
  };

  const handleBackToLobby = () => {
    router.push(`/game/${gameCode}`);
  };

  const handleEndGame = async () => {
    try {
      const response = await GameAPI.completeGame(gameCode);
      if (response.status === 'success') {
        showNotification('Game completed!', 'success', 2000);
        setTimeout(() => {
          router.push(`/game/${gameCode}/final`);
        }, 2000);
      }
    } catch (err) {
      console.error('Error ending game:', err);
    }
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
