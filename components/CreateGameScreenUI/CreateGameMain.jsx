'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import { getSocket } from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import CreateGameUI from './CreateGameUI';
import CreateGameActions from './CreateGameActions';

export default function CreateGameMain() {
  const router = useRouter();
  const [gameCreated, setGameCreated] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [socketInstance, setSocketInstance] = useState(null);
  // Socket setup
  useEffect(() => {
    let currentSocket;

    if (gameCreated && gameCode) {
      console.log(`[Host Effect] Game created (${gameCode}). Setting up socket.`);
      currentSocket = getSocket();
      setSocketInstance(currentSocket);

      const handleHostConnectAndJoin = () => {
        console.log(`[Host Effect] Socket connected (or was already connected) for game ${gameCode}. Emitting join-game.`);
        setConnectionStatus('connected'); 
        currentSocket.emit('join-game', {
          gameCode: gameCode,
          isHost: true,
        });
      };

      const onConnect = () => {
        console.log(`[Host Socket] 'connect' event for game ${gameCode}.`);
        handleHostConnectAndJoin();
      };

      const onDisconnect = (reason) => {
        console.log(`[Host Socket] 'disconnect' event for game ${gameCode}. Reason: ${reason}`);
        setConnectionStatus('disconnected');
        showNotification('Connection lost. Attempting to reconnect...', 'error', 5000);
      };

      const onReconnecting = (attemptNumber) => {
        console.log(`[Host Socket] 'reconnecting' event for game ${gameCode}, attempt ${attemptNumber}.`);
        setConnectionStatus('reconnecting');
      };

      const onPlayerJoined = (data) => {
        if (data && data.gameCode === gameCode) {
          console.log(`[Host Socket] 'player-joined' event for game ${gameCode}:`, data);
          setPlayers(data.players || []);
          if (data.newPlayer) {
            showNotification(`🎉 ${data.newPlayer.name} joined the game!`, 'success', 3000);
          }
        } else if (data) {
            console.log(`[Host Socket] 'player-joined' event for different game (${data.gameCode}), ignoring.`);
        }
      };

      const onPlayerLeft = (data) => {
        if (data && data.gameCode === gameCode) {
          console.log(`[Host Socket] 'player-left' event for game ${gameCode}:`, data);
          setPlayers(data.players || []);
          if (data.leftPlayer) {
            showNotification(`😢 ${data.leftPlayer.name} left the game`, 'info', 3000);
          }
        } else if (data) {
            console.log(`[Host Socket] 'player-left' event for different game (${data.gameCode}), ignoring.`);
        }
      };

      const onRoomJoined = (data) => {
        if (data && data.gameCode === gameCode) {
          console.log(`[Host Socket] 'room-joined' event for game ${gameCode}:`, data);
          setConnectionStatus('connected');
          setPlayers(data.players || []);
          const hostInList = (data.players || []).find(p => p.isHost);
          if (hostInList) {
            console.log(`[Host Socket] Host confirmed in player list for game ${gameCode}.`);
          } else {
            console.warn(`[Host Socket] Host *not* found in player list from 'room-joined' for game ${gameCode}. Server might need adjustment.`);
          }
        } else if (data) {
            console.log(`[Host Socket] 'room-joined' event for different game (${data.gameCode}), ignoring.`);
        }
      };

      const onErrorEvent = (errorData) => {
        if (errorData && typeof errorData === 'object' && errorData.gameCode && errorData.gameCode !== gameCode) {
            console.log(`[Host Socket] 'error' event for different game (${errorData.gameCode}), ignoring.`);
            return;
        }
        console.error(`[Host Socket] 'error' event for game ${gameCode}:`, errorData);
        const message = (typeof errorData === 'object' && errorData.message) ? errorData.message : 'A connection error occurred.';
        setError(message);
        showNotification(message, 'error', 5000);
        if (message.toLowerCase().includes('join')) {
            setConnectionStatus('disconnected');
        }
      };

      console.log(`[Host Effect] Registering socket listeners for game ${gameCode}.`);
      currentSocket.on('connect', onConnect);
      currentSocket.on('disconnect', onDisconnect);
      currentSocket.on('reconnecting', onReconnecting);
      currentSocket.on('player-joined', onPlayerJoined);
      currentSocket.on('player-left', onPlayerLeft);
      currentSocket.on('room-joined', onRoomJoined);
      currentSocket.on('error', onErrorEvent);

      if (currentSocket.connected) {
        console.log(`[Host Effect] Socket was already connected for game ${gameCode}. Proceeding to join.`);
        handleHostConnectAndJoin();
      } else {
        console.log(`[Host Effect] Socket not connected yet for game ${gameCode}. Waiting for 'connect' event.`);
        setConnectionStatus('reconnecting'); 
      }

      return () => {
        console.log(`[Host Effect Cleanup] Cleaning up socket listeners for game ${gameCode}.`);
        if (currentSocket) {
          if (currentSocket.connected && gameCode) {
            console.log(`[Host Effect Cleanup] Emitting 'leave-game' for ${gameCode}.`);
            currentSocket.emit('leave-game', { gameCode });
          }
          currentSocket.off('connect', onConnect);
          currentSocket.off('disconnect', onDisconnect);
          currentSocket.off('reconnecting', onReconnecting);
          currentSocket.off('player-joined', onPlayerJoined);
          currentSocket.off('player-left', onPlayerLeft);
          currentSocket.off('room-joined', onRoomJoined);
          currentSocket.off('error', onErrorEvent);
        }
        setSocketInstance(null);
      };
    } else if (!gameCreated && socketInstance) {
        console.log(`[Host Effect Cleanup] Game not created, but socket instance exists. Ensuring cleanup for ${gameCode || 'unknown game'}.`);
        if (socketInstance.connected && gameCode) {
             socketInstance.emit('leave-game', { gameCode });
        }
    }
  }, [gameCreated, gameCode]); // gameCode dependency is important here

  const handleCreateGame = async (hostName) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await GameAPI.createGame(hostName);
      
      if (response.status === 'success') {
        // Set gameCode and players first
        setGameCode(response.data.gameCode);
        setPlayers(response.data.players || []); 
        // Then set gameCreated to true to trigger the useEffect with the correct gameCode
        setGameCreated(true); 
        
        showNotification('Game created successfully!', 'success', 3000);
      } else {
        setError(response.message || 'Failed to create game');
        showNotification(response.message || 'Failed to create game', 'error', 3000);
      }
    } catch (err) {
      const errorMessage = err.message || 'Unable to connect to server';
      setError(errorMessage);
      showNotification(errorMessage, 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      showNotification('Game code copied to clipboard!', 'success', 2000);
    } catch (err) {
      showNotification('Failed to copy game code', 'error', 2000);
    }
  };
  const handleStartGame = () => {
    if (players.length >= 2) {
      // Emit start game event to all players in the room
      const socket = getSocket();
      socket.emit('start-game', { gameCode });
      
      // Navigate to game screen
      router.push(`/game/${gameCode}`);
    } else {
      showNotification('Need at least 2 players to start the game', 'error', 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <CreateGameUI 
        gameCreated={gameCreated}
        gameCode={gameCode}
        players={players}
        error={error}
        isLoading={isLoading}
        connectionStatus={connectionStatus}
        onCreateGame={handleCreateGame}
        onCopyGameCode={handleCopyGameCode}
      />
      
      {gameCreated && (
        <CreateGameActions 
          players={players}
          onStartGame={handleStartGame}
          onBackToHome={() => router.push('/')}
        />
      )}
    </div>
  );
}
