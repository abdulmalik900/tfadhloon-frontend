'use client';

export default function FinalActions({
  onNewGame,
  onJoinNewGame,
  onBackToHome,
  onShareResults
}) {

  return (
    <div className="mt-6 w-full max-w-4xl space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onNewGame}
          className="font-bold text-xl py-4 px-6 rounded-3xl shadow-xl transform transition-all duration-200 bg-white text-purple-600 hover:shadow-2xl hover:scale-105"
        >
          🎮 Create New Game
        </button>
        
        <button
          onClick={onJoinNewGame}
          className="font-bold text-xl py-4 px-6 rounded-3xl shadow-xl transform transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-2xl hover:scale-105"
        >
          🎯 Join Another Game
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onShareResults}
          className="bg-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
        >
          📤 Share Results
        </button>
        
        <button
          onClick={onBackToHome}
          className="bg-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
        >
          🏠 Back to Home
        </button>
      </div>

      {/* Thank You Message */}
      <div className="text-center mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
        <div className="text-3xl mb-2">🎉</div>
        <h3 className="text-white font-semibold mb-2">Thanks for Playing!</h3>
        <p className="text-white/80 text-sm">
          Hope you had fun! Start a new game or join friends for another round.
        </p>
      </div>

      {/* Game Over Badge */}
      <div className="text-center text-white/60 text-xs mt-4">
        🏁 Game Complete • Thanks for playing! 🏁
      </div>
    </div>
  );
}
