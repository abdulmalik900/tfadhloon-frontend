'use client';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';

export default function ResultsUI({
  roundResults,
  playerChoices,
  currentQuestion,
  correctAnswer,
  scoreboard,
  isLoading,
  error,
  showScores
}) {

  if (isLoading) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-white text-lg">Loading results...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Results</h1>
            <p className="text-red-100">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (showScores && scoreboard.length > 0) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              🏆 Current Scoreboard
            </h1>
            <p className="text-white/80">See how everyone is doing!</p>
          </div>

          {/* Scoreboard */}
          <div className="space-y-3">
            {scoreboard.map((player, index) => (
              <div key={player.id || index} className={`p-4 rounded-xl border flex items-center justify-between ${
                index === 0 
                  ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100' 
                  : index === 1
                  ? 'bg-gray-400/20 border-gray-300/30 text-gray-100'
                  : index === 2
                  ? 'bg-orange-500/20 border-orange-400/30 text-orange-100'
                  : 'bg-white/10 border-white/20 text-white'
              }`}>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm opacity-80">{player.score} points</div>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {player.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackgroundAnimations />
      
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎯 Round Results
          </h1>
          <p className="text-white/80">See how everyone predicted!</p>
        </div>

        {/* Question Recap */}
        {currentQuestion && (
          <div className="mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h2 className="text-white font-semibold mb-2 text-center">
                📝 The Question
              </h2>
              <p className="text-white/90 text-center">
                {currentQuestion.text || currentQuestion.question}
              </p>
            </div>
          </div>
        )}

        {/* Correct Answer */}
        {correctAnswer && (
          <div className="mb-6">
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
              <h2 className="text-green-100 font-semibold mb-2 text-center">
                ✅ Correct Answer
              </h2>
              <p className="text-white text-center font-medium">
                {correctAnswer}
              </p>
            </div>
          </div>
        )}

        {/* Player Predictions */}
        {playerChoices && playerChoices.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-semibold mb-4 text-center">
              🎭 Player Predictions
            </h2>
            <div className="space-y-3">
              {playerChoices.map((choice, index) => (
                <div key={choice.playerId || index} className={`p-4 rounded-xl border ${
                  choice.isCorrect 
                    ? 'bg-green-500/20 border-green-400/30' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="text-xl mr-2">
                        {choice.isCorrect ? '🎯' : '❌'}
                      </div>
                      <span className={`font-semibold ${
                        choice.isCorrect ? 'text-green-100' : 'text-white'
                      }`}>
                        {choice.playerName}
                      </span>
                    </div>
                    {choice.isCorrect && (
                      <div className="bg-green-400/30 text-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                        +{choice.pointsEarned || 10} pts
                      </div>
                    )}
                  </div>
                  <div className={`text-sm ${
                    choice.isCorrect ? 'text-green-200/90' : 'text-white/80'
                  }`}>
                    "{choice.prediction || choice.choice}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Round Summary */}
        {roundResults && (
          <div className="text-center text-white/80">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
              <h3 className="text-blue-100 font-semibold mb-2">
                📊 Round Summary
              </h3>
              <div className="text-sm space-y-1">
                <p>Correct Predictions: {roundResults.correctCount || 0}</p>
                <p>Total Players: {playerChoices.length}</p>
                <p>Accuracy: {playerChoices.length > 0 ? Math.round((roundResults.correctCount / playerChoices.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
