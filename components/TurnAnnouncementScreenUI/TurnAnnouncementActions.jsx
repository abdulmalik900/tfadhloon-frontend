'use client';

export default function TurnAnnouncementActions({
  countdown,
  isMyTurn,
  onStartRound,
  onSkipCountdown,
  onBackToLobby
}) {

  return (
    <div className="mt-6 w-full max-w-3xl space-y-4">
      {/* Primary Action Button */}
      {countdown > 0 ? (
        <button
          onClick={onSkipCountdown}
          className="w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 bg-white text-purple-600 hover:shadow-2xl hover:scale-105"
        >
          ⚡ Skip Countdown
        </button>
      ) : (
        <button
          onClick={onStartRound}
          className="w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 bg-white text-purple-600 hover:shadow-2xl hover:scale-105"
        >
          🚀 Start Round
        </button>
      )}

      {/* Ready Indicator for Current Player */}
      {isMyTurn && countdown > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 text-center">
          <div className="text-yellow-100 font-semibold mb-1">
            🌟 You're up next!
          </div>
          <div className="text-yellow-200/80 text-sm">
            Get ready to make your prediction first this round
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBackToLobby}
        className="w-full bg-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
      >
        ← Back to Game Lobby
      </button>

      {/* Help Text */}
      <div className="text-center text-white/60 text-xs">
        {countdown > 0 ? (
          `Round ${isMyTurn ? 'starts' : 'begins'} automatically in ${countdown} seconds`
        ) : (
          'Ready to start the round!'
        )}
      </div>
    </div>
  );
}
