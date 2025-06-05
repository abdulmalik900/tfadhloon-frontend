'use client';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';

export default function TurnAnnouncementUI({
  currentPlayer,
  nextQuestion,
  currentRound,
  totalRounds,
  isMyTurn,
  countdown,
  isLoading,
  error,
  allPlayers
}) {

  if (isLoading) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-white text-lg">Preparing next round...</p>
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
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-red-100">{error}</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">
            🎯 Round {currentRound}
          </h1>
          <div className="text-white/80 text-lg">
            Round {currentRound} of {totalRounds}
          </div>
        </div>

        {/* Countdown Circle */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10">
              <div className="text-4xl font-bold text-white">
                {countdown}
              </div>
            </div>
            <div className="absolute inset-0 w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/60"
                  strokeDasharray={`${(countdown / 5) * 283} 283`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-white/80 mt-4">
            Starting in {countdown} seconds...
          </p>
        </div>

        {/* Current Player Highlight */}
        {currentPlayer && (
          <div className="mb-6">
            <div className={`p-6 rounded-2xl border text-center ${
              isMyTurn 
                ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100' 
                : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
            }`}>
              <div className="text-3xl mb-2">
                {isMyTurn ? '🌟' : '👤'}
              </div>
              <h2 className="text-xl font-bold mb-2">
                {isMyTurn ? "It's Your Turn!" : `${currentPlayer.name}'s Turn`}
              </h2>
              <p className="text-sm opacity-90">
                {isMyTurn 
                  ? 'Get ready to make your prediction!'
                  : `${currentPlayer.name} will be making the first prediction this round`
                }
              </p>
            </div>
          </div>
        )}

        {/* Question Preview */}
        {nextQuestion && (
          <div className="mb-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 text-center flex items-center justify-center">
                <span className="mr-2">📝</span>
                Next Question Preview
              </h3>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/90 text-center">
                  {nextQuestion.text || nextQuestion.question}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Instructions */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3 text-center">
            🎮 How to Play
          </h3>
          <div className="text-white/80 text-sm space-y-2">
            <div className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>Read the question carefully</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>Make your best prediction</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>Submit before time runs out</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">4️⃣</span>
              <span>Earn points for correct answers</span>
            </div>
          </div>
        </div>

        {/* All Players List */}
        {allPlayers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white/80 text-sm font-semibold mb-3 text-center">
              🏁 Turn Order
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {allPlayers.map((player, index) => (
                <div key={player.id || index} className={`px-3 py-2 rounded-lg text-xs border ${
                  player.id === currentPlayer?.id
                    ? 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30 font-semibold'
                    : 'bg-white/10 text-white/80 border-white/20'
                }`}>
                  {index + 1}. {player.name}
                  {player.id === currentPlayer?.id && ' 👑'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
