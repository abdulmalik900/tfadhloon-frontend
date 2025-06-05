'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import { getSocket } from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import AnsweringUI from './AnsweringUI';
import AnsweringActions from './AnsweringActions';

export default function AnsweringMain({ gameCode }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [myAnswer, setMyAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitAnswer(); // Auto-submit when time runs out
    }
  }, [timeLeft, isSubmitted]);

  // Socket setup
  useEffect(() => {
    if (gameCode) {
      setupSocketConnection();
      fetchCurrentQuestion();
    }
  }, [gameCode]);

  const setupSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('answeringPhase', (data) => {
      setCurrentQuestion(data.question);
      setTimeLeft(data.answerTimeLimit || 30);
      setPredictions(data.predictions || []);
      setIsSubmitted(false);
      setMyAnswer('');
      setPlayerAnswers([]);
    });

    socket.on('roundResults', (data) => {
      router.push(`/game/${gameCode}/results`);
    });

    socket.on('finalScores', () => {
      router.push(`/game/${gameCode}/final`);
    });

    return () => {
      socket.off('answeringPhase');
      socket.off('roundResults');
      socket.off('finalScores');
    };
  };

  const fetchCurrentQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await GameAPI.getCurrentQuestion(gameCode);
      
      if (response.status === 'success') {
        setCurrentQuestion(response.data.question);
        setPlayers(response.data.players || []);
        setTimeLeft(response.data.timeLeft || 30);
        setPredictions(response.data.predictions || []);
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

  const handleSubmitAnswer = async () => {
    if (!myAnswer.trim()) {
      setError('Please enter an answer');
      return;
    }

    try {
      const response = await GameAPI.submitAnswer(gameCode, myAnswer.trim());
      
      if (response.status === 'success') {
        setIsSubmitted(true);
        setError('');
        showNotification('Answer submitted!', 'success', 2000);
        
        // Emit to socket using new event structure
        const socket = getSocket();
        socket.emit('submitAnswer', {
          gameCode,
          answer: myAnswer.trim()
        });
      } else {
        setError(response.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error('Error submitting answer:', err);
    }
  };

  const handleBackToLobby = () => {
    router.push(`/game/${gameCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnsweringUI
          currentQuestion={currentQuestion}
          myAnswer={myAnswer}
          setMyAnswer={setMyAnswer}
          isSubmitted={isSubmitted}
          timeLeft={timeLeft}
          playerAnswers={playerAnswers}
          players={players}
          predictions={predictions}
          error={error}
          isLoading={isLoading}
        />
        
        <AnsweringActions
          myAnswer={myAnswer}
          isSubmitted={isSubmitted}
          timeLeft={timeLeft}
          onSubmitAnswer={handleSubmitAnswer}
          onBackToLobby={handleBackToLobby}
        />
      </div>
    </div>
  );
}
