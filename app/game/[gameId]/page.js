'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import GameAPI from '@/app/services/GameApis';
import { getSocket, joinRoom } from '@/app/services/socket';
import { useLocalStorageState } from '@/app/utils/localStorage';

import TurnAnnouncementMain from '@/components/TurnAnnouncementScreenUI/TurnAnnouncementMain';
import PredictionMain from '@/components/PredictionScreenUI/PredictionMain';
import AnsweringMain from '@/components/AnsweringScreenUI/AnsweringMain';
import ResultsMain from '@/components/ResultsScreenUI/ResultsMain';
import ScoreboardMain from '@/components/ScoreboardScreenUI/ScoreboardMain';
import FinalMain from '@/components/FinalScreenUI/FinalMain';

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId;
  
  const [gamePhase, setGamePhase] = useState('loading');
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [playerId, setPlayerId, isPlayerIdHydrated] = useLocalStorageState('playerId');
  const [playerName, setPlayerName, isPlayerNameHydrated] = useLocalStorageState('playerName');
  
  const determineGamePhase = useCallback((data) => {
    if (!data) return 'loading';
    
    if (data.gameStatus === 'finished') {
      return 'final';
    } else if (data.gameStatus === 'in-progress') {
      switch (data.currentPhase) {
        case 'turn-announcement': return 'turn-announcement';
        case 'prediction': return 'prediction';
        case 'results': return 'results';
        case 'scoreboard': return 'scoreboard';
        default: return 'prediction';
      }
    } else {
      return 'turn-announcement';
    }
  }, []);
  
  const loadGameState = useCallback(async () => {
    if (!gameId) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await GameAPI.getGameState(gameId);
      
      if (response && response.status === 'success') {
        const data = response.data;
        setGameData(data);
        setGamePhase(determineGamePhase(data));
      } else {
        setError(response?.message || 'Failed to load game state');
      }
    } catch (err) {
      console.error('Error loading game state:', err);
      setError('Failed to connect to game');
    } finally {
      setIsLoading(false);
    }
  }, [gameId, determineGamePhase, setGameData, setGamePhase, setIsLoading, setError]);
  
  useEffect(() => {
    if (isPlayerIdHydrated && gameId) {
      loadGameState();
    }
  }, [gameId, isPlayerIdHydrated, loadGameState]);
  
  useEffect(() => {
    if (!isPlayerIdHydrated || !gameId || !playerId) return;
    
    const socket = getSocket();
    // Use joinRoom from socket service instead of emit
    joinRoom(gameId, playerId, playerName);
    
    const handleRoomUpdate = (data) => {
      setGameData(prev => ({ ...prev, players: data.players || prev?.players }));
    };
    
    const handleGameStarted = (data) => {
      setGameData(data);
      setGamePhase('turn-announcement');
    };
    
    const handleRoundStarted = (data) => {
      setGameData(prev => ({ ...prev, currentQuestion: data.question, currentRound: data.roundNumber }));
      setGamePhase('prediction');
    };
    
    const handleAnsweringPhase = (data) => {
      setGamePhase('answering');
    };
    
    const handleRoundResults = (data) => {
      setGameData(prev => ({ ...prev, ...data }));
      setGamePhase('results');
    };
    
    const handleFinalScores = (data) => {
      setGameData(prev => ({ ...prev, ...data }));
      setGamePhase('final');
    };
    
    const handlePlayerDisconnected = (data) => {
      if (data.leftPlayer) {
        setGameData(prev => ({
          ...prev,
          players: prev?.players?.filter(p => p.id !== data.leftPlayer.id) || []
        }));
      }
    };
    
    socket.on('roomUpdate', handleRoomUpdate);
    socket.on('gameStarted', handleGameStarted);
    socket.on('roundStarted', handleRoundStarted);
    socket.on('answeringPhase', handleAnsweringPhase);
    socket.on('roundResults', handleRoundResults);
    socket.on('finalScores', handleFinalScores);
    socket.on('playerDisconnected', handlePlayerDisconnected);
    
    return () => {
      socket.off('roomUpdate', handleRoomUpdate);
      socket.off('gameStarted', handleGameStarted);
      socket.off('roundStarted', handleRoundStarted);
      socket.off('answeringPhase', handleAnsweringPhase);
      socket.off('roundResults', handleRoundResults);
      socket.off('finalScores', handleFinalScores);
      socket.off('playerDisconnected', handlePlayerDisconnected);
    };
  }, [gameId, playerId, playerName, isPlayerIdHydrated]);
  
  if (!isPlayerIdHydrated || !isPlayerNameHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading game...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Game Error</h2>
          <p className="text-lg mb-4">{error}</p>
          <button 
            onClick={loadGameState}
            className="bg-white text-red-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  switch (gamePhase) {
    case 'turn-announcement':
      return <TurnAnnouncementMain gameCode={gameId} />;
    case 'prediction':
      return <PredictionMain gameCode={gameId} />;
    case 'answering':
      return <AnsweringMain gameCode={gameId} />;
    case 'results':
      return <ResultsMain gameCode={gameId} />;
    case 'scoreboard':
      return <ScoreboardMain gameCode={gameId} />;
    case 'final':
      return <FinalMain gameCode={gameId} />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Connecting to Game...</h2>
          </div>
        </div>
      );
  }
}
