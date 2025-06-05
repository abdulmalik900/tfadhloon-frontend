'use client';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';

export default function PredictionUI({
  currentQuestion,
  myPrediction,
  setMyPrediction,
  isSubmitted,
  timeLeft,
  playerPredictions,
  players,
  error,
  isLoading,
  gamePhase
}) {

  if (isLoading) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-white text-lg">Loading question...</p>
        </div>
      </>
    );
  }

  if (gamePhase === 'waiting') {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              ⏳ Waiting for Others
            </h1>
            <p className="text-white/80">
              All predictions are in! Preparing results...
            </p>
          </div>

          {/* Predictions Summary */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-center">
              📊 Predictions Submitted
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {players.map((player, index) => {
                const hasPrediction = playerPredictions.some(p => p.playerId === player.id);
                return (
                  <div key={player.id || index} className={`p-3 rounded-xl border ${
                    hasPrediction 
                      ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                      : 'bg-gray-500/20 border-gray-400/30 text-gray-300'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        hasPrediction ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm font-medium">{player.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Loading Animation */}
          <div className="text-center">
            <div className="animate-bounce text-2xl mb-2">🎯</div>
            <p className="text-white/60 text-sm">Calculating results...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackgroundAnimations />
      
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Header with Timer */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">
              🎯 Make Your Prediction
            </h1>
            <div className={`px-4 py-2 rounded-xl border font-bold ${
              timeLeft <= 10 
                ? 'bg-red-500/20 border-red-400/30 text-red-100' 
                : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
            }`}>
              {timeLeft}s
            </div>
          </div>
          
          {/* Timer Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-red-400' : 'bg-blue-400'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h2 className="text-white font-semibold text-lg mb-2 text-center">
                📝 Question
              </h2>
              <p className="text-white/90 text-center">
                {currentQuestion.text || currentQuestion.question}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
            <p className="text-red-100 text-center">{error}</p>
          </div>
        )}

        {/* Prediction Input */}
        {!isSubmitted ? (
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-semibold mb-2">
              Your Prediction
            </label>
            <textarea
              value={myPrediction}
              onChange={(e) => setMyPrediction(e.target.value)}
              placeholder="Enter your prediction here..."
              maxLength={200}
              rows={3}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent resize-none"
              disabled={timeLeft === 0}
            />
            <div className="text-right text-xs text-white/60 mt-1">
              {myPrediction.length}/200 characters
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
              <div className="flex items-center justify-center text-green-100 mb-2">
                <div className="mr-2">✅</div>
                <span className="font-semibold">Prediction Submitted!</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/90 text-sm text-center">
                  "{myPrediction}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Players Status */}
        <div className="text-center">
          <h3 className="text-white/80 text-sm font-semibold mb-2">
            Player Status
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {players.map((player, index) => {
              const hasPrediction = playerPredictions.some(p => p.playerId === player.id);
              return (
                <div key={player.id || index} className={`px-3 py-1 rounded-full text-xs ${
                  hasPrediction 
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                    : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                }`}>
                  {player.name} {hasPrediction ? '✓' : '⏳'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
