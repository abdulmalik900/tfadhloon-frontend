'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import { getSocket, joinRoom, setupSocketListeners } from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import JoinGameUI from './JoinGameUI';
import JoinGameActions from './JoinGameActions';

export default function JoinGameMain() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Socket setup when joined
  useEffect(() => {
    if (!isJoined || !gameCode || !playerId) return;

    console.log('Setting up socket for joined game:', gameCode);
    const socket = getSocket();

    const socketCallbacks = {
      onRoomUpdate: (data) => {
        console.log('Room update:', data);
        if (data.players) {
          setPlayers(data.players);
        }
      },
        onGameStarted: (data) => {
        console.log('Game started:', data);
        setGameStarted(true);
        showNotification('🚀 Game is starting! Redirecting...', 'success', 2000);
        setTimeout(() => {
          router.push(`/game/${gameCode}`);
        }, 2000);
      },
      
      onPlayerDisconnected: (data) => {
        console.log('Player disconnected:', data);
        if (data.leftPlayer) {
          showNotification(`😢 ${data.leftPlayer.name} left the game`, 'info', 3000);
        }
      }
    };

    const cleanup = setupSocketListeners(socketCallbacks);

    const handleConnect = () => {
      console.log('Socket connected for game:', gameCode);
      setConnectionStatus('connected');
      joinRoom(gameCode, playerId, playerName);
    };

    const handleDisconnect = (reason) => {
      console.log('Socket disconnected:', reason);
      setConnectionStatus('disconnected');
      showNotification('Connection lost. Attempting to reconnect...', 'error', 3000);
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus('disconnected');
      setError('Connection error occurred');
    };

    // Register basic connection events
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Join if already connected
    if (socket.connected) {
      handleConnect();
    } else {
      setConnectionStatus('reconnecting');
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up socket listeners for game:', gameCode);
      cleanup();
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [isJoined, gameCode, playerId, playerName, router]);

  const handleJoinGame = async () => {
    if (!gameCode.trim() || !playerName.trim()) {
      setError('Please enter both game code and your name');
      showNotification('Please enter both game code and your name', 'error', 3000);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to join game with code:', gameCode.trim().toUpperCase());
      
      // Validate game code first
      const validationResponse = await GameAPI.validateGameCode(gameCode.trim().toUpperCase());
      console.log('Validation response:', validationResponse);
      
      if (!validationResponse.data?.isValid) {
        setError('Invalid game code - Please check the code and try again');
        showNotification('Invalid game code', 'error', 3000);
        return;
      }

      if (!validationResponse.data?.canJoin) {
        setError('Cannot join this game - Room may be full or game already started');
        showNotification('Cannot join this game', 'error', 3000);
        return;
      }

      // Join the game
      const response = await GameAPI.joinGame(gameCode.trim().toUpperCase(), playerName.trim());
      console.log('Join game response:', response);      if (response.status === 'success') {
        // Save player info in localStorage for the game room to access
        localStorage.setItem('playerId', response.data.playerId);
        localStorage.setItem('playerName', playerName.trim());
        showNotification(`Successfully joined game ${gameCode}!`, 'success', 3000);
        
        // Redirect to the dedicated game room page
        router.push(`/game-room?code=${gameCode.trim().toUpperCase()}`);
      } else {
        setError(response.message || 'Failed to join game - Please try again');
        showNotification(response.message || 'Failed to join game', 'error', 4000);
      }
    } catch (err) {
      console.error('Join game error:', err);
      const errorMsg = err.message || 'Connection error. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGame = async () => {
    if (!isJoined || !playerId) return;

    try {
      // Leave the API game
      await GameAPI.leaveGame(gameCode, playerId);
      
      // Reset state
      setIsJoined(false);
      setGameStarted(false);
      setPlayers([]);
      setPlayerId('');
      setConnectionStatus('disconnected');
      
      showNotification('Left the game', 'info', 2000);
    } catch (err) {
      console.error('Leave game error:', err);
      showNotification('Error leaving game', 'error', 2000);
    }
  };

  const handleBackToHome = () => {
    if (isJoined) {
      handleLeaveGame();
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <JoinGameUI 
        gameCode={gameCode}
        setGameCode={setGameCode}
        playerName={playerName}
        setPlayerName={setPlayerName}
        isJoined={isJoined}
        gameStarted={gameStarted}
        players={players}
        error={error}
        isLoading={isLoading}
        connectionStatus={connectionStatus}
        onJoinGame={handleJoinGame}
      />
      
      {isJoined && (
        <JoinGameActions 
          gameStarted={gameStarted}
          onLeaveGame={handleLeaveGame}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}
