'use client';
import { useState, useEffect } from 'react';

const PlayerList = ({ 
  players = [], 
  currentPlayerId = null, 
  maxPlayers = 3, 
  showHostControls = false,
  onRemovePlayer = null,
  showPlayerStatus = true,
  compact = false 
}) => {
  const [animatingPlayers, setAnimatingPlayers] = useState(new Set());

  // Handle player join/leave animations
  useEffect(() => {
    const newPlayerIds = new Set(players.map(p => p.id));
    const prevPlayerIds = new Set(animatingPlayers);
    
    // Find newly joined players
    const joinedPlayers = players.filter(p => !prevPlayerIds.has(p.id));
    
    if (joinedPlayers.length > 0) {
      joinedPlayers.forEach(player => {
        setAnimatingPlayers(prev => new Set([...prev, player.id]));
        // Remove animation after 2 seconds
        setTimeout(() => {
          setAnimatingPlayers(prev => {
            const updated = new Set(prev);
            updated.delete(player.id);
            return updated;
          });
        }, 2000);
      });
    }
  }, [players]);

  const getPlayerStatusIcon = (player) => {
    if (player.isHost) return '👑';
    if (player.id === currentPlayerId) return '🎯';
    if (player.status === 'ready') return '✅';
    if (player.status === 'disconnected') return '🔴';
    return '🟢';
  };

  const getPlayerStatusText = (player) => {
    if (player.isHost) return 'HOST';
    if (player.id === currentPlayerId) return 'YOU';
    if (player.status === 'ready') return 'READY';
    if (player.status === 'disconnected') return 'OFFLINE';
    return 'ONLINE';
  };
  const getPlayerCardClass = (player) => {
    let baseClass = 'rounded-xl p-4 flex items-center justify-between transition-all duration-500 transform';
    
    if (compact) {
      baseClass = 'rounded-lg p-3 flex items-center justify-between transition-all duration-500 transform';
    }

    if (player.isHost) {
      return `${baseClass} bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400/50 shadow-lg`;
    }

    if (player.id === currentPlayerId) {
      return `${baseClass} bg-gradient-to-r from-blue-400/30 to-purple-400/30 border-2 border-blue-400/50`;
    }

    if (player.status === 'disconnected') {
      return `${baseClass} bg-white/10 opacity-60 border border-red-400/50`;
    }

    return `${baseClass} bg-white/20 backdrop-blur-sm border border-white/20`;
  };

  return (
    <div className={`${compact ? 'space-y-2' : 'space-y-3'}`}>      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">
          {players.some(p => p.isHost) ? (
            <>Host + Players ({players.filter(p => !p.isHost).length}/{maxPlayers - 1})</>
          ) : (
            <>Players ({players.length}/{maxPlayers})</>
          )}
        </h3>
        {showPlayerStatus && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80 text-sm">Live</span>
          </div>
        )}
      </div>

      <div className={`${compact ? 'max-h-48' : 'max-h-60'} overflow-y-auto space-y-2 custom-scrollbar`}>
        {players.map((player, index) => (
          <div key={player.id || index} className={getPlayerCardClass(player)}>
            <div className="flex items-center space-x-3">
              {/* Player Avatar */}
              <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold relative overflow-hidden`}>
                {player.avatar ? (
                  <span className="text-xl">{player.avatar}</span>
                ) : (
                  <span className={compact ? 'text-sm' : 'text-lg'}>
                    {player.name ? player.name.charAt(0).toUpperCase() : 'P'}
                  </span>
                )}
                
                {/* Online/Offline indicator */}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  player.status === 'disconnected' ? 'bg-red-500' : 'bg-green-500'
                }`}></div>
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-white font-medium ${compact ? 'text-sm' : 'text-base'}`}>
                    {player.name || 'Anonymous'}
                  </span>
                  
                  {/* Player Status Badge */}
                  {player.isHost && (
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      {getPlayerStatusText(player)}
                    </span>
                  )}
                  
                  {player.id === currentPlayerId && !player.isHost && (
                    <span className="bg-blue-400 text-blue-900 px-2 py-1 rounded-full text-xs font-bold">
                      {getPlayerStatusText(player)}
                    </span>
                  )}
                </div>
                
                {/* Player stats or additional info */}
                {player.score !== undefined && (
                  <div className="text-white/60 text-xs mt-1">
                    Score: {player.score} {player.matches && `(${player.matches})`}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Status and Actions */}
            <div className="flex items-center space-x-2">
              {/* Status Icon */}
              <span className={`${compact ? 'text-lg' : 'text-xl'}`}>
                {getPlayerStatusIcon(player)}
              </span>

              {/* Host Controls */}
              {showHostControls && onRemovePlayer && !player.isHost && (
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors text-xs"
                  title="Remove player"
                >
                  ×
                </button>
              )}              {/* Connection indicator */}
              {player.status !== 'disconnected' && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
            </div>
          </div>
        ))}        {/* Empty slots - adjust count based on whether host is present */}
        {(() => {
          const hostPresent = players.some(p => p.isHost);
          const effectiveMaxPlayers = hostPresent ? maxPlayers - 1 : maxPlayers;
          const regularPlayerCount = players.filter(p => !p.isHost).length;
          const emptySlotCount = hostPresent 
            ? effectiveMaxPlayers - regularPlayerCount 
            : maxPlayers - players.length;
          
          return Array.from({ length: Math.max(0, emptySlotCount) }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className={`${compact ? 'rounded-lg p-3' : 'rounded-xl p-4'} bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">👤</div>
                <span className="text-white/50 text-sm">Waiting for player...</span>
              </div>
            </div>
          ));
        })()}
      </div>      {/* Player count info - adjusted for host separation */}
      {!compact && (
        <div className="mt-4 text-center">
          {(() => {
            const hostPresent = players.some(p => p.isHost);
            const effectiveMaxPlayers = hostPresent ? maxPlayers - 1 : maxPlayers;
            const regularPlayerCount = players.filter(p => !p.isHost).length;
            const neededPlayers = effectiveMaxPlayers - regularPlayerCount;
            
            if (neededPlayers > 0) {
              return (
                <p className="text-white/70 text-sm">
                  Need {neededPlayers} more player{neededPlayers !== 1 ? 's' : ''} to start
                </p>
              );
            } else {
              return (
                <p className="text-green-300 text-sm font-medium">
                  🎉 All players ready!
                </p>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default PlayerList;
