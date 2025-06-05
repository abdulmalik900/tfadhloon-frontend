'use client';

export default function AnsweringActions({
  myAnswer,
  isSubmitted,
  timeLeft,
  onSubmitAnswer,
  onBackToLobby
}) {
  const canSubmit = myAnswer.trim().length > 0 && !isSubmitted && timeLeft > 0;

  return (
    <div className="mt-8 space-y-4">
      {/* Submit Answer Button */}
      <button
        onClick={onSubmitAnswer}
        disabled={!canSubmit}
        className={`w-full font-bold text-xl py-6 px-8 rounded-3xl border-2 transition-all duration-300 transform ${
          canSubmit
            ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white border-transparent hover:from-green-600 hover:to-teal-700 hover:scale-105 shadow-2xl hover:shadow-green-500/25'
            : 'bg-white/20 text-white/60 border-white/30 cursor-not-allowed scale-100'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {isSubmitted ? (
            <>
              <span className="text-3xl">✅</span>
              <span>Answer Submitted!</span>
            </>
          ) : timeLeft === 0 ? (
            <>
              <span className="text-3xl">⏰</span>
              <span>Time's Up!</span>
            </>
          ) : canSubmit ? (
            <>
              <span className="text-3xl">🚀</span>
              <span>Submit Answer</span>
            </>
          ) : (
            <>
              <span className="text-3xl opacity-50">✍️</span>
              <span>Enter your answer above</span>
            </>
          )}
        </div>
      </button>

      {/* Timer Warning */}
      {timeLeft <= 10 && timeLeft > 0 && !isSubmitted && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 text-center animate-pulse">
          <p className="text-red-200 font-bold">
            ⚠️ Only {timeLeft} seconds remaining!
          </p>
        </div>
      )}

      {/* Status Messages */}
      {isSubmitted && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 text-center">
          <p className="text-green-200">
            🎯 Great! Waiting for other players to submit their answers...
          </p>
        </div>
      )}

      {timeLeft === 0 && !isSubmitted && (
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-2xl p-4 text-center">
          <p className="text-orange-200">
            ⏰ Time's up! Moving to results...
          </p>
        </div>
      )}

      {/* Back to Lobby Button */}
      <button
        onClick={onBackToLobby}
        className="w-full bg-white/15 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white/25 transition-all duration-300 border border-white/30 hover:border-white/40 backdrop-blur-sm flex items-center justify-center space-x-2 transform hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Game Lobby</span>
      </button>
    </div>
  );
}
