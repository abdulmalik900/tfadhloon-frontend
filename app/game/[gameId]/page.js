'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import GameAPI from '@/app/services/GameApis';
import getSocket from '@/app/services/socket';
import { useLocalStorageState } from '@/app/utils/localStorage';

// Import all game screens
import TurnAnnouncementMain from '@/components/TurnAnnouncementScreenUI/TurnAnnouncementMain';
import PredictionMain from '@/components/PredictionScreenUI/PredictionMain';
import ResultsMain from '@/components/ResultsScreenUI/ResultsMain';
import ScoreboardMain from '@/components/ScoreboardScreenUI/ScoreboardMain';
import FinalMain from '@/components/FinalScreenUI/FinalMain';

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId;
  
  // Game state management
  const [gameState, setGameState] = useState({
    gameId: gameId,
    gamePhase: 'loading', // 'loading', 'playerTurn', 'predicting', 'result', 'leaderboard', 'final'
    players: [],
    currentPlayerId: null,
    currentCycle: 1,
    currentQuestion: null,
    gameStatus: 'active'
  });  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [clientData, setClientData] = useState({ playerId: null, gameId: null });
  
  // Use safe localStorage hooks
  const [playerId, setPlayerId, isPlayerIdHydrated] = useLocalStorageState('playerId');
  const [gameIdStored, setGameIdStored, isGameIdHydrated] = useLocalStorageState('gameId');
  
  const isFullyHydrated = isPlayerIdHydrated && isGameIdHydrated;
  // Define loadGameState function with useCallback BEFORE it's used in useEffect
  const loadGameState = useCallback(async () => {
    if (!gameId) {
      setError('No game ID provided'); // Set error if gameId is missing
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(''); // Clear any previous errors
    
    try {
      console.log('Loading game state for gameId:', gameId);
      const response = await GameAPI.getRoomStatus(gameId);
      
      if (response && response.status === 'success') {
        const gameData = response.data?.gameRoom || response.data || response;
        
        console.log('Game data received:', gameData);
        
        // Validate game data
        if (!gameData) {
          throw new Error('No game data received from server');
        }
        
        setGameState(prev => ({
          ...prev,
          players: gameData.players || [],
          gameStatus: gameData.gameStatus || 'active',
          currentPlayerId: gameData.currentPlayerId || prev.currentPlayerId,
          currentCycle: gameData.currentCycle || gameData.currentRound || 1,
          currentQuestion: gameData.currentQuestion || null,
          gamePhase: determineGamePhase(gameData)
        }));
        
        console.log('Game state updated successfully');
      } else {
        const errorMessage = response?.message || 'Failed to load game state';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      const errorMessage = error.message || 'Unknown error occurred while loading game';
      setError(`Failed to load game: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);
    // Initialize client-side data
  useEffect(() => {
    setIsClient(true);
    setClientData({
      playerId: localStorage.getItem('playerId'),
      gameId: localStorage.getItem('gameId')
    });
  }, []);
  
  // Handle client-side initialization and validation
  useEffect(() => {
    if (!isClient) return;
    
    // Set current player ID from client data
    const storedPlayerId = clientData.playerId;
    if (storedPlayerId) {
      setCurrentPlayerId(storedPlayerId);
      setGameState(prev => ({
        ...prev,
        currentPlayerId: storedPlayerId
      }));
    }
    
    // Validate game session and load game state
    const storedGameId = clientData.gameId;
    if (gameId && gameId === storedGameId) {
      loadGameState();
    } else if (gameId && !storedGameId) {
      // If no stored gameId but we have a valid gameId from URL, this might be a direct link entry
      // or a player rejoining after clearing localStorage. Attempt to load.
      console.warn('No stored gameId found, but attempting to load game state from URL gameId.');
      loadGameState();
    } else if (!gameId && storedGameId) {
      // This case should ideally redirect to /game/[storedGameId] or home
      // For now, set an error or redirect to home
      console.warn('URL gameId is missing, but a stored gameId exists. Consider redirecting.');
      setError('Game ID mismatch or missing. Please return to home or check the game link.');
      setIsLoading(false);
      // router.push('/'); // Or router.push(`/game/${storedGameId}`);
    } else if (gameId && gameId !== storedGameId) {
      // Game ID in URL does not match stored game ID
      console.warn('URL gameId does not match stored gameId.');
      setError('Game session mismatch. Please ensure you are using the correct game link or rejoin.');
      setIsLoading(false);
      // Potentially clear localStorage here if the session is deemed invalid
      // localStorage.removeItem('gameId');
      // localStorage.removeItem('playerId');
      // router.push('/');
    } else if (!gameId && !storedGameId) {
      // No gameId in URL and no stored gameId
      setError('No game session found. Please create or join a game.');
      setIsLoading(false);
      // router.push('/');
    }
  }, [isClient, gameId, clientData, loadGameState]); // Ensure all dependencies are listed

  // Helper function to determine the current game phase based on game data
  const determineGamePhase = (gameData) => {
    if (!gameData) {
      console.warn('No game data provided to determineGamePhase');
      return 'loading';
    }
    
    const status = gameData.gameStatus || gameData.status;
    const phase = gameData.currentPhase || gameData.phase;
    
    console.log('Determining game phase:', { status, phase, gameData });
    
    // Handle finished/completed games
    if (status === 'finished' || status === 'completed' || status === 'ended') {
      return 'final';
    }
    
    // Handle active games
    if (status === 'active' || status === 'in-progress' || status === 'started') {
      switch (phase) {
        case 'predicting':
        case 'predictions':
          return 'predicting';
        case 'results':
        case 'result':
        case 'showing-results':
          return 'result';
        case 'leaderboard':
        case 'scoreboard':
          return 'leaderboard';
        case 'player-turn':
        case 'turn':
        default:
          return 'playerTurn';
      }
    }
    
    // Handle waiting/lobby state
    if (status === 'waiting' || status === 'lobby') {
      return 'loading';
    }
    
    // Default fallback
    console.warn('Unknown game status/phase, defaulting to playerTurn:', { status, phase });
    return 'playerTurn';
  };
  const handleStartPredictions = async () => {
    try {
      // Update game phase locally
      setGameState(prev => ({ ...prev, gamePhase: 'predicting' }));
      
      // In a real implementation, you might need to notify the backend
      // that predictions have started for this round
    } catch (error) {
      console.error('Failed to start predictions:', error);
    }
  };

  const handlePredictionSubmit = async (prediction, isActualAnswer) => {
    try {
      if (isActualAnswer) {
        // Current player submitted their answer
        const response = await GameAPI.submitAnswer(gameId, currentPlayerId, prediction);
        if (response.status === 'success') {
          setGameState(prev => ({ 
            ...prev, 
            currentAnswer: prediction,
            gamePhase: 'result' 
          }));
        }
      } else {
        // Other player submitted prediction
        const response = await GameAPI.submitPrediction(gameId, currentPlayerId, prediction);
        if (response.status === 'success') {
          console.log('Prediction submitted successfully');
        }
      }
    } catch (error) {
      console.error('Failed to submit prediction/answer:', error);
    }
  };

  const handleNextRound = async () => {
    try {
      // Load updated game state from backend
      await loadGameState();
    } catch (error) {
      console.error('Failed to proceed to next round:', error);
    }
  };

  const handleNextCycle = async () => {
    try {
      // Load updated game state from backend
      await loadGameState();
    } catch (error) {
      console.error('Failed to proceed to next cycle:', error);
    }
  };
  const renderGameScreen = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-white text-xl">Loading game...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Game Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }    switch (gameState.gamePhase) {      
      case 'playerTurn':
        return (
          <TurnAnnouncementMain 
            gameState={gameState}
            onStartPredictions={handleStartPredictions}
          />
        );
      
      case 'predicting':
        return (
          <PredictionMain 
            gameState={gameState}
            currentPlayerId={currentPlayerId}
            onPredictionSubmit={handlePredictionSubmit}
          />
        );
        
      case 'result':
        return (
          <ResultsMain 
            gameState={gameState}
            onNext={handleNextRound}
          />
        );
      
      case 'leaderboard':
        return (
          <ScoreboardMain 
            gameState={gameState}
            onNextCycle={handleNextCycle}
          />
        );
      
      case 'final':
        return (
          <FinalMain 
            gameId={gameId}
          />
        );
        
      default:
        return (
          <TurnAnnouncementMain 
            gameState={gameState}
            onStartPredictions={handleStartPredictions}
          />
        );
    }
  };
    // Socket.io integration for real-time updates
  useEffect(() => {
    if (!isClient || !gameId || !currentPlayerId) return;
    
    console.log('Setting up socket connection for game:', gameId, 'player:', currentPlayerId);
    
    const socket = getSocket();
    
    // Join the game room
    socket.emit('join-room', { gameCode: gameId, playerId: currentPlayerId });
    
    // Socket event handlers
    const handlePlayerJoined = (data) => {
      console.log('Player joined:', data);
      setGameState(prev => ({ ...prev, players: data.players }));
    };
    
    const handlePlayerLeft = (data) => {
      console.log('Player left:', data);
      setGameState(prev => ({ ...prev, players: data.players }));
    };
    
    const handleGameStarted = (data) => {
      console.log('Game started from socket:', data);
      setGameState(prev => ({ 
        ...prev, 
        gamePhase: 'playerTurn', 
        currentCycle: data.currentRound || data.currentCycle || 1, 
        currentPlayerId: data.currentPlayer?.id || prev.currentPlayerId,
        players: data.players || prev.players,
        currentQuestion: data.currentQuestion || null,
        gameStatus: 'started'
      }));
    };
    
    const handleNewRound = (data) => {
      console.log('New round from socket:', data);
      setGameState(prev => ({ 
        ...prev, 
        gamePhase: 'playerTurn', 
        currentCycle: data.round || data.currentCycle || prev.currentCycle + 1, 
        currentPlayerId: data.currentPlayer?.id || prev.currentPlayerId, 
        currentQuestion: data.question || data.currentQuestion || null,
        players: data.players || prev.players, // Ensure players list is updated
        gameStatus: 'active' // Or 'in-progress'
      }));
    };
    
    const handlePredictionsComplete = (data) => {
      console.log('Predictions complete from socket:', data);
      // The backend will likely send new game state or a specific event to move to results
      // For now, we assume the backend sends 'round-complete' or similar to trigger result display
      // If not, we might need to call loadGameState() or set gamePhase directly
      setGameState(prev => ({ 
        ...prev, 
        gamePhase: 'result' // Or as indicated by backend
        // Potentially update other parts of gameState based on `data`
      }));
    };
    
    const handleRoundComplete = (data) => {
      console.log('Round complete from socket:', data);
      setGameState(prev => ({ 
        ...prev, 
        gamePhase: 'result', 
        currentAnswer: data.results?.actualAnswer,
        // Update scores or other relevant data if provided in `data`
        players: data.players || prev.players, // If scores are updated on players
        // Potentially move to 'leaderboard' if it's the end of a cycle
      }));
    };
    
    const handleGameComplete = (data) => {
      console.log('Game complete from socket:', data);
      setGameState(prev => ({ 
        ...prev, 
        gamePhase: 'final', 
        finalResults: data.finalResults || data.leaderboard, // Use leaderboard if finalResults isn't specific
        gameStatus: 'finished'
      }));
    };

    const handleGameUpdate = (data) => {
      console.log('Generic game update from socket:', data);
      // This can be a catch-all for various state changes initiated by the server
      setGameState(prev => ({
        ...prev,
        ...data, // Merge in updates from the server
        // Ensure critical fields like gamePhase are handled correctly
        gamePhase: determineGamePhase(data) || prev.gamePhase,
        currentPlayerId: data.currentPlayerId || data.currentPlayer?.id || prev.currentPlayerId,
        currentCycle: data.currentCycle || data.currentRound || prev.currentCycle,
        currentQuestion: data.currentQuestion !== undefined ? data.currentQuestion : prev.currentQuestion,
        players: data.players || prev.players,
        gameStatus: data.gameStatus || prev.gameStatus,
      }));
    };
    
    // Register socket event listeners
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-started', handleGameStarted); // From host starting the game
    socket.on('new-round', handleNewRound); // Start of a new turn/question
    socket.on('predictions-complete', handlePredictionsComplete); // All predictions are in
    socket.on('round-complete', handleRoundComplete); // Round results are available
    socket.on('game-complete', handleGameComplete); // Game has ended
    socket.on('game-update', handleGameUpdate); // Generic state update from server

    
    // Cleanup function
    return () => {
      console.log('Cleaning up socket listeners for game:', gameId);
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-started', handleGameStarted);
      socket.off('new-round', handleNewRound);
      socket.off('predictions-complete', handlePredictionsComplete);
      socket.off('round-complete', handleRoundComplete);
      socket.off('game-complete', handleGameComplete);
      socket.off('game-update', handleGameUpdate);
    };
  }, [isClient, gameId, currentPlayerId, loadGameState]); // Added loadGameState to dependencies

  return renderGameScreen();
}
