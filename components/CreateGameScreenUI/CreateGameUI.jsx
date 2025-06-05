'use client';

import React from 'react';

export default function CreateGameUI({
  gameCreated,
  gameCode,
  players,
  error,
  isLoading,
  connectionStatus,
  onCreateGame,
  onCopyGameCode,
}) {
  const getConnectionStatusIndicator = (status) => {
    switch (status) {
      case 'connected':
        return { colorClass: 'text-green-400', icon: '●', text: 'Connected' };
      case 'disconnected':
        return { colorClass: 'text-red-400', icon: '●', text: 'Disconnected' };
      case 'reconnecting':
        return { colorClass: 'text-yellow-400', icon: '●', text: 'Reconnecting...' };
      default:
        return { colorClass: 'text-gray-400', icon: '●', text: status || 'Unknown' };
    }
  };

  const statusIndicator = getConnectionStatusIndicator(connectionStatus);
  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-white text-center">
      <h1 className="text-4xl font-bold mb-8">Create Game</h1>
      
      {!gameCreated ? (
        <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.target); const hostName = formData.get('hostName'); if (hostName) onCreateGame(hostName); }} className="space-y-6">
          <div>
            <label htmlFor="hostName" className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="hostName"
              id="hostName"
              required
              className="w-full px-4 py-3 bg-white/20 rounded-xl border border-white/30 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all duration-200"
              placeholder="Enter your name"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : '✨ Create New Game'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Game Created!</h2>
          <p className="text-lg">Share this code with your friends:</p>
          <div className="flex items-center justify-center space-x-2 bg-black/20 p-4 rounded-xl">
            <span className="text-3xl font-mono tracking-widest">{gameCode || 'N/A'}</span>
            <button
              onClick={onCopyGameCode}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              title="Copy Game Code"
            >
              📋
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Players Joined: {players ? players.length : 0} / 4</h3>
            {players && players.length > 0 ? (
              <ul className="space-y-2 text-left max-h-40 overflow-y-auto bg-black/10 p-3 rounded-lg">
                {players.map((player, index) => (
                  <li key={player.id || index} className="p-2 bg-white/5 rounded-md">
                    {player.isHost ? '👑 ' : ''}{player.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">Waiting for players to join...</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
      
      <div className="mt-4 text-sm flex items-center justify-center space-x-2">
        <span className={statusIndicator.colorClass}>{statusIndicator.icon}</span>
        <span className={`font-medium ${statusIndicator.colorClass}`}>{statusIndicator.text}</span>
      </div>
    </div>
  );
}