'use client';
import { useState, useEffect } from 'react';

export default function CreateGameUI({
  playerName,
  setPlayerName,
  error,
  isLoading,
  onCreateGame
}) {  const [language, setLanguage] = useState('en');
  const [isPlayerNameValid, setIsPlayerNameValid] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [players, setPlayers] = useState([]);
  const [gameCode, setGameCode] = useState(null); // Added to fix ReferenceError
  const [isCopied, setIsCopied] = useState(false); // Added to prevent potential ReferenceError

  // Validation effect
  useEffect(() => {
    setIsPlayerNameValid(playerName.trim().length >= 2 && playerName.trim().length <= 20);
  }, [playerName]);

  const text = {
    en: {
      title: "Create Game",
      subtitle: "Start a new TFADHLOON game",
      hostNameLabel: "Your Name",
      hostNamePlaceholder: "Enter your name",
      createButton: "Create Game",
      creating: "Creating...",
      gameCreated: "🎉 Game Created!",
      shareCode: "Share this code with your friends",
      gameCode: "Game Code",
      copyCode: "Copy Code",
      copied: "Copied!",
      playersTitle: "Players",
      waitingForPlayers: "Waiting for 3 players to join...",
      languageToggle: "عربي"
    },
    ar: {
      title: "إنشاء لعبة",
      subtitle: "ابدأ لعبة تفضلون جديدة",
      hostNameLabel: "اسمك",
      hostNamePlaceholder: "أدخل اسمك",
      createButton: "إنشاء لعبة",
      creating: "جاري الإنشاء...",
      gameCreated: "🎉 تم إنشاء اللعبة!",
      shareCode: "شارك هذا الرمز مع أصدقائك",
      gameCode: "رمز اللعبة",
      copyCode: "نسخ الرمز",
      copied: "تم النسخ!",
      playersTitle: "اللاعبون",
      waitingForPlayers: "في انتظار انضمام 3 لاعبين...",
      languageToggle: "English"
    }
  };  const handleCreateGame = () => {
    if (playerName.trim() && isPlayerNameValid) {
      onCreateGame();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setPlayerName(value);
    }
  };return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex flex-col relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-8 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Language Toggle */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full font-medium hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg border border-white/30"
          >
            {text[language].languageToggle}
          </button>
        </div>        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-2xl">
            {/* Create Game Form */}
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:border-white/40 transition-all duration-300">
                <div className="text-center mb-8">
                  <div className="mb-4 text-6xl animate-bounce">🎮</div>
                  <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                    {text[language].title}
                  </h1>
                  <p className="text-white/90 text-lg font-medium">
                    {text[language].subtitle}
                  </p>
                </div>                <div className="space-y-6">
                  {/* Enhanced Host Name Input */}
                  <div className="relative">
                    <label className="flex items-center space-x-2 text-white/95 font-semibold mb-3 text-sm uppercase tracking-wide">
                      <span>👑</span>
                      <span>{text[language].hostNameLabel}</span>
                    </label>
                    <div className="relative">                      <input
                        type="text"
                        value={playerName}
                        onChange={handleInputChange}
                        placeholder={text[language].hostNamePlaceholder}
                        className={`w-full px-6 py-4 bg-white/25 backdrop-blur-sm border-2 ${
                          playerName.length > 0 
                            ? isPlayerNameValid 
                              ? 'border-green-400/50 focus:border-green-400 focus:ring-green-400/20' 
                              : 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20'
                            : 'border-white/40 focus:border-white/60 focus:ring-white/30'
                        } rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 transition-all duration-300 font-medium text-lg`}
                        maxLength="20"
                        disabled={isLoading}
                      />                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <span className="text-white/60 text-sm font-mono">{playerName.length}/20</span>
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
                      <p className="text-white/70 text-xs">
                        This will be your display name in the game
                      </p>                      {playerName.length > 0 && !isPlayerNameValid && (
                        <p className="text-red-400 text-xs">
                          {playerName.length < 2 ? 'At least 2 characters' : 'Maximum 20 characters'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Create Button */}
                  <button
                    onClick={handleCreateGame}
                    disabled={!isPlayerNameValid || isLoading}
                    className={`w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all duration-300 transform ${
                      isPlayerNameValid && !isLoading
                        ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:shadow-2xl hover:scale-105 hover:from-green-500 hover:to-blue-600 border-2 border-transparent active:scale-95'
                        : 'bg-white/20 text-white/50 cursor-not-allowed border-2 border-white/20'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{text[language].creating}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-2xl">🚀</span>
                        <span>{text[language].createButton}</span>
                      </div>
                    )}
                  </button>
                    {/* Validation Status */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2 text-white/80">
                      <span className="text-lg">⚡</span>
                      <span className="text-sm font-medium">
                        {playerName ? 
                          isPlayerNameValid ? '✅ Ready to create game!' : '⚠️ Please enter a valid name'
                          : 'Enter your name to create a game'
                        }
                      </span>
                    </div>
                  </div>
                </div>                {/* Enhanced Error Display */}
                {error && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                    <div className="flex items-start space-x-3">
                      <div className="text-red-400 text-2xl">⚠️</div>
                      <div className="flex-1">
                        <p className="text-red-200 font-semibold text-lg">{error}</p>
                        <p className="text-red-300 text-sm mt-1">
                          Please try again or check your connection
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>            ) : (
              // Game Created Success
              <div className="space-y-6">
                {/* Celebration Header */}
                <div className="text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                  <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                      {text[language].gameCreated}
                    </h1>
                    <p className="text-white/90 text-lg font-medium">
                      {text[language].shareCode}
                    </p>
                  </div>
                </div>                {/* Real-time Status */}
                <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  connectionStatus === 'connected' 
                    ? 'bg-emerald-500/20 border-emerald-400/40 shadow-emerald-500/20 shadow-lg' 
                    : connectionStatus === 'reconnecting'
                    ? 'bg-amber-500/20 border-amber-400/40 shadow-amber-500/20 shadow-lg'
                    : 'bg-red-500/20 border-red-400/40 shadow-red-500/20 shadow-lg'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        connectionStatus === 'connected' 
                          ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' 
                          : connectionStatus === 'reconnecting'
                          ? 'bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50'
                          : 'bg-red-400 shadow-lg shadow-red-400/50'
                      }`}></div>
                      <span className="text-white text-sm font-semibold">
                        {connectionStatus === 'connected' ? '🟢 Connected' : 
                         connectionStatus === 'reconnecting' ? '🔄 Reconnecting...' : 
                         '🔴 Disconnected'}
                      </span>
                    </div>
                    <div className="bg-white/20 text-white text-sm px-3 py-1.5 rounded-full font-bold border border-white/30">
                      👥 {players.length}/4
                    </div>
                  </div>
                </div>                {/* Enhanced Game Code Display */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl text-center border-2 border-white/50">
                  <div className="mb-4">
                    <p className="text-gray-600 font-bold mb-2 text-lg uppercase tracking-wide">
                      {text[language].gameCode}
                    </p>
                    <div className="relative">
                      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-widest mb-6 font-mono">
                        {gameCode}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl blur-sm -z-10"></div>
                    </div>
                  </div>
                    {/* Enhanced Share Actions */}
                  <div className="flex flex-col space-y-4">
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button                        onClick={() => {
                          const shareText = `🎮 Join my TFADHLOON game!\n\n🎯 Game Code: ${gameCode}\n\n🚀 Let's play together!`;
                          if (navigator.share) {
                            navigator.share({ title: 'TFADHLOON Game', text: shareText });
                          } else {
                            navigator.clipboard.writeText(shareText);
                          }
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const whatsappText = `🎮 Join my TFADHLOON game!\n\n🎯 Code: ${gameCode}\n\n🚀 Let's have fun!`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
                        }}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>                {/* Enhanced Players Section */}
                <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold text-xl flex items-center space-x-2">
                      <span>👥</span>
                      <span>{text[language].playersTitle}</span>
                    </h3>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
                      {players.length}/4
                    </div>
                  </div>
                    {players.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4 animate-pulse">⏳</div>
                      <p className="text-white/90 text-lg font-medium">
                        {text[language].waitingForPlayers}
                      </p>
                      <p className="text-white/70 text-sm mt-2">
                        Need exactly 3 more players to join!
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        (1 host + 3 players = 4 total)
                      </p>
                    </div>                  ) : (
                    <div className="space-y-4">                      {/* Show current players */}
                      {players.slice(0, 4).map((player, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white/20 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 animate-pulse-once">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {player.name ? player.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold text-lg">{player.name}</span>
                              {player.isHost && (
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
                                  <span>👑</span>
                                  <span>Host</span>
                                </span>
                              )}
                              {index === players.length - 1 && players.length > 1 && (
                                <span className="bg-green-500/30 text-green-200 text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-white/70 text-sm">Ready to play</p>
                          </div>
                          <div className="text-emerald-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show status message based on player count */}
                      {players.length < 4 && (
                        <div className="text-center py-4">
                          <div className="text-4xl mb-2 animate-pulse">⏳</div>
                          <p className="text-white/90 font-semibold">
                            Need {4 - players.length} more player{4 - players.length !== 1 ? 's' : ''} to start!
                          </p>
                          <p className="text-white/70 text-sm mt-1">
                            Share the game code to invite them
                          </p>
                        </div>
                      )}
                      
                      {players.length === 4 && (                        <div className="text-center py-4">
                          <div className="text-4xl mb-2 animate-bounce">🚀</div>
                          <p className="text-emerald-300 font-bold">
                            Perfect! Host + 3 players are ready!
                          </p>
                          <p className="text-emerald-200 text-sm mt-1">
                            Host can now start the game
                          </p>
                        </div>
                      )}
                      
                      {/* Enhanced Empty slots */}
                      {Array.from({ length: 4 - players.length }).map((_, index) => (
                        <div key={`empty-${index}`} className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/40 transition-all duration-300">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white/60 border-2 border-dashed border-white/40">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="text-white/60 font-medium">Waiting for player...</span>
                            <p className="text-white/50 text-sm">Invite a friend to join</p>
                          </div>
                          <div className="text-white/40">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>                {/* Enhanced Game Info */}                <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">⚡</span>
                    <p className="text-white/90 text-sm font-semibold">
                      Host + 3 players required to start the game
                    </p>
                  </div>
                </div>
              </div>
            )
          </div>
        </div>
      </div>
  );
}