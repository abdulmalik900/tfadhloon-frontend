'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import getSocket from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import JoinGameUI from './JoinGameUI';
import JoinGameActions from './JoinGameActions';

export default function JoinGameMain() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  // Socket setup when joined
  useEffect(() => {
    if (isJoined && gameCode) {
      setupSocketConnection();
    }

    // Cleanup function
    return () => {
      if (gameCode && isJoined) {
        const socket = getSocket();
        socket.emit('leave-game', { gameCode, playerName });
        socket.off('connect');
        socket.off('disconnect');
        socket.off('player-joined');
        socket.off('player-left');
        socket.off('game-started');
        socket.off('room-joined');
        socket.off('error');
      }
    };
  }, [isJoined, gameCode, playerName]);
  const setupSocketConnection = () => {
    const socket = getSocket();
    
    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Socket connected for player');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      showNotification('Connection lost', 'error', 3000);
    });

    socket.on('player-joined', (data) => {
      console.log('Player joined event received:', data);
      setPlayers(data.players || []);
      if (data.newPlayer && data.newPlayer.name !== playerName) {
        showNotification(`🎉 ${data.newPlayer.name} joined!`, 'success', 3000);
      }
    });

    socket.on('player-left', (data) => {
      console.log('Player left event received:', data);
      setPlayers(data.players || []);
      if (data.leftPlayer) {
        showNotification(`😢 ${data.leftPlayer.name} left`, 'info', 3000);
      }
    });

    socket.on('game-started', () => {
      setGameStarted(true);
      showNotification('🎮 Game is starting!', 'success', 2000);
      setTimeout(() => {
        router.push(`/game/${gameCode}`);
      }, 2000);
    });

    socket.on('room-joined', (data) => {
      console.log('Room joined successfully:', data);
      setConnectionStatus('connected');
      if (data.players) {
        setPlayers(data.players);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      showNotification('Connection error occurred', 'error', 3000);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-started');
      socket.off('room-joined');
      socket.off('error');
    };
  };
  const handleJoinGame = async () => {
    if (!gameCode.trim() || !playerName.trim()) {
      setError('Please enter both game code and your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await GameAPI.joinGame(gameCode.trim().toUpperCase(), playerName.trim());
      
      // Check for success based on the API response structure
      if (response.status === 'success' || response.success) {
        setIsJoined(true);
        setPlayers(response.data?.players || response.players || []);
        showNotification(`Successfully joined game ${gameCode}!`, 'success', 3000);
        
        // Join socket room
        const socket = getSocket();
        socket.emit('join-game', { 
          gameCode: gameCode.trim().toUpperCase(),
          playerName: playerName.trim(),
          isHost: false
        });
      } else {
        setError(response.message || 'Failed to join game');
        showNotification(response.message || 'Failed to join game', 'error', 4000);
      }
    } catch (err) {
      const errorMsg = err.message || 'Connection error. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGame = async () => {
    if (!isJoined) return;

    try {
      const socket = getSocket();
      socket.emit('leave-game', { gameCode });
      socket.disconnect();
      
      showNotification('Left the game', 'info', 2000);
      router.push('/');
    } catch (err) {
      console.error('Error leaving game:', err);
      router.push('/');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
        
        <JoinGameActions
          gameCode={gameCode}
          gameStarted={gameStarted}
          onLeaveGame={handleLeaveGame}
          isJoined={isJoined}
        />
      </div>
    </div>
  );
}
