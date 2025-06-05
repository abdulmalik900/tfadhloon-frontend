'use client';
import { useState, useEffect } from 'react';
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
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isGameCodeValid, setIsGameCodeValid] = useState(false);
  const [isPlayerNameValid, setIsPlayerNameValid] = useState(false);
  
  // Validation effects
  useEffect(() => {
    setIsGameCodeValid(gameCode.trim().length >= 4);
  }, [gameCode]);
  
  useEffect(() => {
    setIsPlayerNameValid(playerName.trim().length >= 2 && playerName.trim().length <= 20);
  }, [playerName]);
  
  const handleCopyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy game code:', err);
    }
  };
    if (isJoined) {
    return (
      <>
        <BackgroundAnimations />
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              Game Room
            </h1>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-white/30 backdrop-blur-sm">
              <p className="text-white/80 text-sm mb-2">Game Code</p>
              <div className="flex items-center justify-center space-x-3">
                <p className="text-white font-mono text-3xl font-bold tracking-wider">{gameCode}</p>
                <button
                  onClick={handleCopyGameCode}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-all duration-200 hover:scale-105"
                  title="Copy game code"
                >
                  {showCopiedMessage ? (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {showCopiedMessage && (
                <p className="text-green-400 text-sm mt-2 animate-fade-in">Copied to clipboard!</p>
              )}
            </div>
          </div>          {/* Enhanced Connection and Player Status */}
          <RealTimeStatus 
            connectionStatus={connectionStatus}
            playerCount={players.length}
            maxPlayers={4}
            className="mb-6"
            players={players}
          />

          {/* Recent Player Activity */}
          <PlayerActivity players={players} />

          {/* Enhanced Game Status */}
          {gameStarted && (
            <div className="mb-6 text-center">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center text-green-100 space-x-3">
                  <div className="animate-spin text-2xl">🚀</div>
                  <div>
                    <span className="font-bold text-lg">Game Starting!</span>
                    <p className="text-green-200 text-sm mt-1">Get ready for an epic game!</p>
                  </div>
                </div>
              </div>
            </div>
          )}          {/* Enhanced Player List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-xl flex items-center space-x-2">
                <span>👥</span>
                <span>Players in Room</span>
              </h3>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                {players.some(p => p.isHost) ? 
                  `Host + ${players.filter(p => !p.isHost).length}/3` : 
                  `${players.length}/4`}
              </div>
            </div>
            <PlayerList players={players} maxPlayers={3} />
          </div>

          {/* Enhanced Waiting Message */}
          <div className="text-center text-white/80 bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="text-4xl mb-2">
              {gameStarted ? '🎯' : '⏳'}
            </div>
            <p className="text-lg font-medium">
              {gameStarted ? 'Get ready to play!' : 'Waiting for the host to start the game...'}
            </p>
            <p className="text-white/60 text-sm mt-2">
              {gameStarted ? 'The game will begin shortly!' : 'You\'ll be notified when the game starts'}
            </p>
          </div>
        </div>
      </>
    );
  }  // Join Game Form
  return (
    <>
      <BackgroundAnimations />
      
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Join Game
          </h1>
          <p className="text-white/80 text-lg">
            Enter the game code to join your friends!
          </p>
          <p className="text-white/60 text-sm mt-2">
            Get ready for an epic TFADHLOON experience!
          </p>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="text-red-400 text-2xl">⚠️</div>
              <div className="flex-1">
                <p className="text-red-100 font-semibold text-lg">{error}</p>
                <p className="text-red-200 text-sm mt-1">
                  Make sure the game code is correct and the game is still active
                </p>
                <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-400/20">
                  <p className="text-red-200 text-xs">
                    💡 Tip: Game codes are usually 4 digits long and shared by the host
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}        {/* Join Form */}
        <div className="space-y-6">
          {/* Enhanced Game Code Input */}
          <div>
            <label className="flex items-center space-x-2 text-white/90 text-sm font-semibold mb-3">
              <span>🎮</span>
              <span>Game Code</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter 4-digit code (e.g. 4295)"
                maxLength={6}
                className={`w-full bg-white/10 border-2 ${
                  gameCode.length > 0 
                    ? isGameCodeValid 
                      ? 'border-green-400/50 focus:border-green-400 focus:ring-green-400/20' 
                      : 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-white/30 focus:border-white/40 focus:ring-white/20'
                } rounded-xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all duration-200 text-center text-2xl font-mono tracking-wider backdrop-blur-sm`}
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <span className="text-white/50 text-sm">{gameCode.length}/6</span>
                {gameCode.length > 0 && (
                  <div className={isGameCodeValid ? 'text-green-400' : 'text-red-400'}>
                    {isGameCodeValid ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-white/60 text-xs">
                Enter the code shared by the host
              </p>
              {gameCode.length > 0 && !isGameCodeValid && (
                <p className="text-red-400 text-xs">At least 4 characters required</p>
              )}
            </div>
          </div>          {/* Enhanced Player Name Input */}
          <div>
            <label className="flex items-center space-x-2 text-white/90 text-sm font-semibold mb-3">
              <span>👤</span>
              <span>Your Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your display name"
                maxLength={20}
                className={`w-full bg-white/10 border-2 ${
                  playerName.length > 0 
                    ? isPlayerNameValid 
                      ? 'border-green-400/50 focus:border-green-400 focus:ring-green-400/20' 
                      : 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-white/30 focus:border-white/40 focus:ring-white/20'
                } rounded-xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-4 transition-all duration-200 backdrop-blur-sm text-lg`}
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <span className="text-white/50 text-sm">{playerName.length}/20</span>
                {playerName.length > 0 && (
                  <div className={isPlayerNameValid ? 'text-green-400' : 'text-red-400'}>
                    {isPlayerNameValid ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-white/60 text-xs">
                This will be shown to other players
              </p>
              {playerName.length > 0 && !isPlayerNameValid && (
                <p className="text-red-400 text-xs">
                  {playerName.length < 2 ? 'At least 2 characters' : 'Maximum 20 characters'}
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Join Button */}
          <button
            onClick={onJoinGame}
            disabled={isLoading || !isGameCodeValid || !isPlayerNameValid}
            className={`w-full font-bold text-xl py-5 rounded-2xl shadow-xl transform transition-all duration-300 ${
              isLoading || !isGameCodeValid || !isPlayerNameValid
                ? 'bg-gray-400/50 text-gray-300 cursor-not-allowed backdrop-blur-sm'
                : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-2xl hover:scale-105 hover:from-green-600 hover:to-blue-700 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <span>Joining Game...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🚀</span>
                <span>Join Game</span>
              </span>
            )}
          </button>
          
          {/* Enhanced Status Info */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-medium">
                {gameCode ? `Ready to join game: ${gameCode.toUpperCase()}` : 'Enter game details to continue'}
              </span>
            </div>
            {gameCode && isGameCodeValid && isPlayerNameValid && (
              <div className="mt-2 text-center">
                <span className="text-green-400 text-xs font-semibold">✅ Ready to join!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
