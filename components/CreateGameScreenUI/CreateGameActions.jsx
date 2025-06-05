'use client';

export default function CreateGameActions({ 
  players, 
  onStartGame, 
  onBackToHome 
}) {  // Separate host (1) + players (3)
  const requiredRegularPlayers = 3; 
  const currentPlayers = players ? players.length : 0;
  const hostPresent = players ? players.some(player => player.isHost) : false;
  const regularPlayers = players ? players.filter(player => !player.isHost).length : 0;

  const canStartGame = hostPresent && regularPlayers >= requiredRegularPlayers;return (
    <div className="mt-8 w-full max-w-2xl space-y-4">
      {/* Enhanced Game Status Info */}
      <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30">        <div className="text-center">          {!canStartGame ? (
            <div className="space-y-2">
              <div className="text-2xl">⏰</div>
              <p className="text-white/90 font-semibold text-sm">
                Need {requiredRegularPlayers - regularPlayers} more player(s) to start
              </p>
              <p className="text-white/70 text-xs">
                Host + 3 players required to start
              </p>
              <div className="flex justify-center space-x-1 mt-2">
                {/* Host indicator */}
                <div
                  className={`w-3 h-3 rounded-full mr-1 ${
                    hostPresent 
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' 
                      : 'bg-white/30 border border-white/50'
                  }`}
                />
                <span className="text-xs text-white/50 mr-1">+</span>
                {/* Regular player indicators */}
                {Array.from({ length: requiredRegularPlayers }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < regularPlayers 
                        ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' 
                        : 'bg-white/30 border border-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (            <div className="space-y-2">
              <div className="text-2xl">🚀</div>
              <p className="text-emerald-300 font-bold text-sm">
                Perfect! Host + 3 players ready! 🎯
              </p>
              <p className="text-emerald-200 text-xs">
                Host + 3 Players = Ready to start!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Start Game Button */}
      <button
        onClick={onStartGame}
        disabled={!canStartGame}
        className={`w-full font-bold text-lg py-5 px-6 rounded-3xl border-2 transition-all duration-300 transform ${
          canStartGame
            ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-transparent hover:from-emerald-600 hover:to-blue-700 hover:scale-105 shadow-2xl hover:shadow-emerald-500/25'
            : 'bg-white/20 text-white/60 border-white/30 cursor-not-allowed scale-100'
        }`}
      >        <div className="flex items-center justify-center space-x-3">          {canStartGame ? (
            <>
              <span className="text-2xl">🚀</span>
              <span>Start Game Now (Host + {regularPlayers}/{requiredRegularPlayers} players)</span>
            </>
          ) : (
            <>
              <span className="text-2xl opacity-50">⏳</span>
              <span>Waiting for players (Host + {regularPlayers}/{requiredRegularPlayers} players)</span>
            </>
          )}
        </div>
      </button>

      {/* Enhanced Back to Home Button */}
      <button
        onClick={onBackToHome}
        className="w-full bg-white/15 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/25 transition-all duration-300 border border-white/30 hover:border-white/40 backdrop-blur-sm flex items-center justify-center space-x-2 transform hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </button>
    </div>
  );
}
