'use client';
import PlayerList from '@/components/SharedUI/PlayerList';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';
import RealTimeStatus from '@/components/SharedUI/RealTimeStatus';
import PlayerActivity from '@/components/SharedUI/PlayerActivity';

export default function JoinGameUI({
  gameCode,
  setGameCode,
  playerName,
  setPlayerName,
  isJoined,
  gameStarted,
  players,
  error,
  isLoading,
  connectionStatus,
  onJoinGame
}) {
  
  if (isJoined) {
    return (
      <>
        <BackgroundAnimations />
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              🎮 Game Room
            </h1>
            <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
              <p className="text-white/80 text-sm mb-1">Game Code</p>
              <p className="text-white font-mono text-2xl font-bold">{gameCode}</p>
            </div>
          </div>          {/* Connection and Player Status */}
          <RealTimeStatus 
            connectionStatus={connectionStatus}
            playerCount={players.length}
            maxPlayers={4}
            className="mb-4"
          />

          {/* Recent Player Activity */}
          <PlayerActivity players={players} />

          {/* Game Status */}
          {gameStarted && (
            <div className="mb-4 text-center">
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3">
                <div className="flex items-center justify-center text-green-100">
                  <div className="animate-spin mr-2">🚀</div>
                  <span className="font-semibold">Game Starting...</span>
                </div>
              </div>
            </div>
          )}

          {/* Player List */}
          <div className="mb-6">
            <PlayerList players={players} />
          </div>

          {/* Waiting Message */}
          <div className="text-center text-white/80">
            <p className="text-sm">
              {gameStarted ? 'Get ready to play!' : 'Waiting for the host to start the game...'}
            </p>
          </div>
        </div>
      </>
    );
  }

  // Join Game Form
  return (
    <>
      <BackgroundAnimations />
      
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎯 Join Game
          </h1>
          <p className="text-white/80 text-lg">
            Enter the game code to join your friends!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
            <p className="text-red-100 text-center">{error}</p>
          </div>
        )}

        {/* Join Form */}
        <div className="space-y-6">
          {/* Game Code Input */}
          <div>
            <label className="block text-white/90 text-sm font-semibold mb-2">
              Game Code
            </label>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="Enter game code"
              maxLength={6}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-center text-xl font-mono"
              disabled={isLoading}
            />
          </div>

          {/* Player Name Input */}
          <div>
            <label className="block text-white/90 text-sm font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Join Button */}
          <button
            onClick={onJoinGame}
            disabled={isLoading || !gameCode.trim() || !playerName.trim()}
            className={`w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 ${
              isLoading || !gameCode.trim() || !playerName.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-purple-600 hover:shadow-2xl hover:scale-105'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin mr-2">🔄</div>
                Joining...
              </span>
            ) : (
              '🚀 Join Game'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
