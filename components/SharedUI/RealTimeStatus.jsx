'use client';
import { useState, useEffect } from 'react';

export default function RealTimeStatus({ 
  connectionStatus, 
  playerCount = 0, 
  maxPlayers = 4,
  showPlayerCount = true,
  className = ""
}) {
  const [pulseCount, setPulseCount] = useState(0);

  // Pulse animation on player count change
  useEffect(() => {
    if (playerCount > 0) {
      setPulseCount(prev => prev + 1);
    }
  }, [playerCount]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500/20 text-green-100 border-green-400/30';
      case 'reconnecting':
        return 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30';
      case 'disconnected':
        return 'bg-red-500/20 text-red-100 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-100 border-gray-400/30';
    }
  };

  const getStatusDot = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-400';
      case 'reconnecting':
        return 'bg-yellow-400 animate-pulse';
      case 'disconnected':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢 Connected';
      case 'reconnecting':
        return '🔄 Reconnecting...';
      case 'disconnected':
        return '🔴 Disconnected';
      default:
        return '⚫ Unknown';
    }
  };

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Connection Status */}
      <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm border ${getStatusColor()}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot()}`}></div>
        {getStatusText()}
      </div>

      {/* Player Count with animation */}
      {showPlayerCount && (
        <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm bg-blue-500/20 text-blue-100 border border-blue-400/30 transition-all duration-300 ${
          pulseCount > 0 ? 'animate-bounce' : ''
        }`}>
          <span className="mr-2">👥</span>
          <span className="font-semibold">{playerCount}/{maxPlayers}</span>
          {playerCount < maxPlayers && (
            <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          )}
        </div>
      )}
    </div>
  );
}
