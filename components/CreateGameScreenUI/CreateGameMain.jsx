'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameAPI from '@/app/services/GameApis';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import { useLocalStorageState } from '@/app/utils/localStorage';
import CreateGameUI from './CreateGameUI';

export default function CreateGameMain() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [playerId, setPlayerId] = useLocalStorageState('playerId');
  const [playerName, setPlayerName, isPlayerNameHydrated] = useLocalStorageState('playerName');

  const handleCreateGame = async () => {
    const currentName = playerName || ''; // Ensure we have a string
    if (!currentName.trim()) {
      setError('Please enter your name first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await GameAPI.createGame(currentName.trim());
      
      if (response.status === 'success') {
        const gameCode = response.data.gameCode;
        const newPlayerId = response.data.playerId;
        
        // Store player info
        setPlayerId(newPlayerId);
        
        showNotification('🎉 Game created successfully!', 'success', 2000);
        
        // Redirect to game room
        setTimeout(() => {
          router.push(`/game-room?code=${gameCode}`);
        }, 1000);
      } else {
        setError(response.message || 'Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CreateGameUI
      playerName={playerName || ''}
      setPlayerName={(name) => setPlayerName(name)}
      error={error}
      isLoading={isLoading}
      onCreateGame={handleCreateGame}
    />
  );
}
