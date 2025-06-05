'use client';

export default function PredictionActions({
  myPrediction,
  isSubmitted,
  timeLeft,
  gamePhase,
  onSubmitPrediction,
  onBackToLobby
}) {

  if (gamePhase === 'waiting') {
    return (
      <div className="mt-6 w-full max-w-2xl space-y-4">
        <button
          onClick={onBackToLobby}
          className="w-full bg-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
        >
          ← Back to Game Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-2xl space-y-4">
      {/* Submit Prediction Button */}
      {!isSubmitted && (
        <button
          onClick={onSubmitPrediction}
          disabled={!myPrediction.trim() || timeLeft === 0}
          className={`w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 ${
            !myPrediction.trim() || timeLeft === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white text-purple-600 hover:shadow-2xl hover:scale-105'
          }`}
        >
          {timeLeft === 0 ? (
            '⏰ Time\'s Up!'
          ) : (
            '🚀 Submit Prediction'
          )}
        </button>
      )}

      {/* Submitted State */}
      {isSubmitted && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
          <div className="text-green-100 font-semibold">
            ✅ Prediction Submitted!
          </div>
          <div className="text-green-200/80 text-sm mt-1">
            Waiting for other players...
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
        {!isSubmitted ? (
          timeLeft > 0 ? (
            `Make your prediction quickly! ${timeLeft} seconds remaining.`
          ) : (
            'Time is up! Your prediction will be auto-submitted.'
          )
        ) : (
          'Your prediction has been recorded. Results coming soon!'
        )}
      </div>
    </div>
  );
}
