'use client';

export default function AnsweringUI({
  currentQuestion,
  myAnswer,
  setMyAnswer,
  isSubmitted,
  timeLeft,
  playerAnswers,
  players,
  predictions,
  error,
  isLoading
}) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          🤔 Answer Time!
        </h1>
        <p className="text-white/80 text-lg">
          Now answer the question based on the predictions
        </p>
      </div>

      {/* Timer */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
        <div className={`text-6xl font-bold mb-2 ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
          {timeLeft}
        </div>
        <p className="text-white/80">seconds remaining</p>
        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-400' : 'bg-green-400'}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Display */}
      {currentQuestion && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            📝 Question
          </h2>
          <div className="bg-white/20 rounded-2xl p-6 border border-white/30">
            <p className="text-white text-xl leading-relaxed text-center">
              {currentQuestion.text}
            </p>
          </div>
        </div>
      )}

      {/* Predictions Display */}
      {predictions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            🔮 Player Predictions
          </h3>
          <div className="grid gap-3">
            {predictions.map((prediction, index) => (
              <div 
                key={index}
                className="bg-white/20 rounded-xl p-4 border border-white/30"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">
                    {prediction.playerName || `Player ${index + 1}`}
                  </span>
                  <span className="text-white/80 text-sm">
                    "{prediction.prediction}"
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer Input */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          ✍️ Your Answer
        </h2>
        
        {isSubmitted ? (
          <div className="text-center">
            <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-100 mb-2">
                Answer Submitted!
              </h3>
              <p className="text-green-200">
                Your answer: "{myAnswer}"
              </p>
              <p className="text-green-200/80 text-sm mt-2">
                Waiting for other players...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full bg-white/20 border border-white/30 rounded-xl p-4 text-white placeholder-white/60 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
              rows={3}
              maxLength={200}
              disabled={isSubmitted}
            />
            <div className="text-right text-white/60 text-sm">
              {myAnswer.length}/200 characters
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Player Status */}
      {players.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            👥 Player Status ({playerAnswers.length}/{players.length} answered)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {players.map((player, index) => {
              const hasAnswered = playerAnswers.some(a => a.playerId === player.id);
              return (
                <div 
                  key={player.id || index}
                  className={`rounded-xl p-3 border ${
                    hasAnswered 
                      ? 'bg-green-500/20 border-green-400/30' 
                      : 'bg-white/20 border-white/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {hasAnswered ? '✅' : '⏳'}
                    </span>
                    <span className="text-white font-medium">
                      {player.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
