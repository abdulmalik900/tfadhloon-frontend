'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/app/services/socket';
import { showNotification } from '@/components/SharedUI/GameNotifications';
import HomeUI from './HomeUI';
import HomeActions from './HomeActions';

export default function HomeMain() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [recentGames, setRecentGames] = useState([]);
  useEffect(() => {
    // Load recent games
    const savedGames = localStorage.getItem('recentGames');
    if (savedGames) {
      try {
        setRecentGames(JSON.parse(savedGames));
      } catch (err) {
        console.error('Error loading recent games:', err);
      }
    }

    // Test socket connection
    testConnection();

    return () => {
      // Clean up socket connection
      const socket = getSocket();
      socket.disconnect();
    };
  }, []);

  const testConnection = () => {
    try {
      const socket = getSocket();
      
      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected successfully');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      socket.on('connect_error', (error) => {
        setIsConnected(false);
        console.error('Socket connection error:', error);
      });

    } catch (error) {
      setIsConnected(false);
      console.error('Error setting up socket:', error);
    }
  };
  const handleCreateGame = () => {
    router.push('/create-game');
  };

  const handleJoinGame = () => {
    router.push('/join-game');
  };

  const handleQuickJoin = (gameCode) => {
    router.push(`/join-game?code=${gameCode}`);
  };

  const handleClearHistory = () => {
    setRecentGames([]);
    localStorage.removeItem('recentGames');
    showNotification('Game history cleared', 'info', 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">        <HomeUI
          isConnected={isConnected}
          recentGames={recentGames}
          onQuickJoin={handleQuickJoin}
          onClearHistory={handleClearHistory}
        />
        
        <HomeActions
          isConnected={isConnected}
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
        />
      </div>
    </div>
  );
}
