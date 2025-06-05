'use client';
import { useState, useEffect } from 'react';

export default function PlayerActivity({ players = [], maxPlayers = 3 }) {
  const [recentActivity, setRecentActivity] = useState([]);
  const [previousPlayerCount, setPreviousPlayerCount] = useState(0);

  useEffect(() => {
    const currentPlayerCount = players.length;
    
    if (currentPlayerCount > previousPlayerCount) {
      // Player joined
      const newPlayers = players.slice(previousPlayerCount);
      newPlayers.forEach(player => {
        const activity = {
          id: Date.now() + Math.random(),
          type: 'join',
          playerName: player.name,
          timestamp: new Date(),
          icon: '🎉'
        };
        
        setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
        
        // Remove after 5 seconds
        setTimeout(() => {
          setRecentActivity(prev => prev.filter(item => item.id !== activity.id));
        }, 5000);
      });
    } else if (currentPlayerCount < previousPlayerCount) {
      // Player left
      const activity = {
        id: Date.now() + Math.random(),
        type: 'leave',
        playerName: 'Someone',
        timestamp: new Date(),
        icon: '👋'
      };
      
      setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
      
      // Remove after 5 seconds
      setTimeout(() => {
        setRecentActivity(prev => prev.filter(item => item.id !== activity.id));
      }, 5000);
    }
    
    setPreviousPlayerCount(currentPlayerCount);
  }, [players.length, previousPlayerCount]);

  if (recentActivity.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="space-y-2">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{activity.icon}</span>
                <span className="text-white text-sm">
                  {activity.type === 'join' 
                    ? `${activity.playerName} joined the game!`
                    : `${activity.playerName} left the game`
                  }
                </span>
              </div>
              <span className="text-white/60 text-xs">
                {activity.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
