'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import getSocket from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import PredictionUI from './PredictionUI';
import PredictionActions from './PredictionActions';

export default function PredictionMain({ gameCode }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [playerPredictions, setPlayerPredictions] = useState([]);
  const [myPrediction, setMyPrediction] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [gamePhase, setGamePhase] = useState('prediction'); // prediction, waiting, results

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && gamePhase === 'prediction') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitPrediction(); // Auto-submit when time runs out
    }
  }, [timeLeft, isSubmitted, gamePhase]);

  // Socket setup
  useEffect(() => {
    if (gameCode) {
      setupSocketConnection();
      fetchCurrentQuestion();
    }
  }, [gameCode]);

  const setupSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('question-data', (data) => {
      setCurrentQuestion(data.question);
      setTimeLeft(data.timeLeft || 30);
      setGamePhase('prediction');
      setIsSubmitted(false);
      setMyPrediction('');
      setPlayerPredictions([]);
    });

    socket.on('prediction-submitted', (data) => {
      setPlayerPredictions(prev => {
        const updated = prev.filter(p => p.playerId !== data.playerId);
        return [...updated, data];
      });
    });

    socket.on('prediction-phase-ended', (data) => {
      setGamePhase('waiting');
      setPlayerPredictions(data.predictions || []);
      showNotification('Prediction phase ended!', 'info', 2000);
    });

    socket.on('round-results', (data) => {
      setGamePhase('results');
      router.push(`/game/${gameCode}/results`);
    });

    socket.on('game-ended', () => {
      router.push(`/game/${gameCode}/final`);
    });

    return () => {
      socket.off('question-data');
      socket.off('prediction-submitted');
      socket.off('prediction-phase-ended');
      socket.off('round-results');
      socket.off('game-ended');
    };
  };

  const fetchCurrentQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await GameAPI.getCurrentQuestion(gameCode);
      
      if (response.success) {
        setCurrentQuestion(response.question);
        setPlayers(response.players || []);
        setTimeLeft(response.timeLeft || 30);
      } else {
        setError(response.message || 'Failed to load question');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error('Error fetching question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPrediction = async () => {
    if (!myPrediction.trim()) {
      setError('Please enter a prediction');
      return;
    }

    try {
      const response = await GameAPI.submitPrediction(gameCode, myPrediction.trim());
      
      if (response.success) {
        setIsSubmitted(true);
        setError('');
        showNotification('Prediction submitted!', 'success', 2000);
        
        // Emit to socket
        const socket = getSocket();
        socket.emit('submit-prediction', {
          gameCode,
          prediction: myPrediction.trim()
        });
      } else {
        setError(response.message || 'Failed to submit prediction');
      }
    } catch (err) {
      setError('Failed to submit prediction. Please try again.');
      console.error('Error submitting prediction:', err);
    }
  };

  const handleBackToLobby = () => {
    router.push(`/game/${gameCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <PredictionUI
          currentQuestion={currentQuestion}
          myPrediction={myPrediction}
          setMyPrediction={setMyPrediction}
          isSubmitted={isSubmitted}
          timeLeft={timeLeft}
          playerPredictions={playerPredictions}
          players={players}
          error={error}
          isLoading={isLoading}
          gamePhase={gamePhase}
        />
        
        <PredictionActions
          myPrediction={myPrediction}
          isSubmitted={isSubmitted}
          timeLeft={timeLeft}
          gamePhase={gamePhase}
          onSubmitPrediction={handleSubmitPrediction}
          onBackToLobby={handleBackToLobby}
        />
      </div>
    </div>
  );
}
