'use client';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';

export default function FinalUI({
  finalResults,
  winner,
  finalScoreboard,
  gameStats,
  isLoading,
  error,
  playerStats
}) {

  if (isLoading) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-white text-lg">Loading final results...</p>
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

  return (
    <>
      <BackgroundAnimations />
      
      <div className="space-y-6">
        {/* Winner Announcement */}
        {winner && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h1 className="text-4xl font-bold text-yellow-300 mb-2">
                Congratulations!
              </h1>
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-6">
                <h2 className="text-3xl font-bold text-yellow-100 mb-2">
                  {winner.name}
                </h2>
                <p className="text-yellow-200/90 text-xl">
                  🎉 Winner with {winner.score} points! 🎉
                </p>
              </div>
            </div>
            
            {/* Winner Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-white/60">Correct Answers</div>
                <div className="text-white font-bold text-lg">{winner.correctAnswers || 0}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-white/60">Accuracy</div>
                <div className="text-white font-bold text-lg">
                  {gameStats?.totalQuestions ? Math.round((winner.correctAnswers / gameStats.totalQuestions) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Scoreboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              📊 Final Results
            </h2>
            <p className="text-white/80">Complete game standings</p>
          </div>

          {/* Podium (Top 3) */}
          {finalScoreboard.length >= 3 && (
            <div className="mb-8">
              <div className="flex items-end justify-center space-x-4">
                {/* Second Place */}
                <div className="text-center">
                  <div className="bg-gray-400/30 border border-gray-300/50 rounded-xl p-4 mb-2">
                    <div className="text-3xl mb-2">🥈</div>
                    <div className="font-bold text-gray-100">{finalScoreboard[1]?.name}</div>
                    <div className="text-2xl font-bold text-gray-100">{finalScoreboard[1]?.score}</div>
                  </div>
                  <div className="bg-gray-400/20 h-16 rounded-t-lg"></div>
                </div>

                {/* First Place */}
                <div className="text-center">
                  <div className="bg-yellow-500/30 border border-yellow-400/50 rounded-xl p-6 mb-2 transform scale-110">
                    <div className="text-4xl mb-2">🥇</div>
                    <div className="font-bold text-yellow-100 text-lg">{finalScoreboard[0]?.name}</div>
                    <div className="text-3xl font-bold text-yellow-100">{finalScoreboard[0]?.score}</div>
                  </div>
                  <div className="bg-yellow-500/30 h-20 rounded-t-lg"></div>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className="bg-orange-500/30 border border-orange-400/50 rounded-xl p-4 mb-2">
                    <div className="text-3xl mb-2">🥉</div>
                    <div className="font-bold text-orange-100">{finalScoreboard[2]?.name}</div>
                    <div className="text-2xl font-bold text-orange-100">{finalScoreboard[2]?.score}</div>
                  </div>
                  <div className="bg-orange-500/20 h-12 rounded-t-lg"></div>
                </div>
              </div>
            </div>
          )}

          {/* Full Rankings */}
          <div className="space-y-3">
            {finalScoreboard.map((player, index) => (
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
                  <div className="text-2xl mr-4 min-w-[3rem] text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{player.name}</div>
                    <div className="text-sm opacity-80">
                      {player.correctAnswers || 0} correct • {gameStats?.totalQuestions ? Math.round((player.correctAnswers / gameStats.totalQuestions) * 100) : 0}% accuracy
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">{player.score}</div>
                  <div className="text-xs opacity-80">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Statistics */}
        {gameStats && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                📈 Game Statistics
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-white/60 text-sm">Total Questions</div>
                <div className="text-white font-bold text-xl">{gameStats.totalQuestions || 0}</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-white/60 text-sm">Players</div>
                <div className="text-white font-bold text-xl">{finalScoreboard.length}</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-white/60 text-sm">Avg Score</div>
                <div className="text-white font-bold text-xl">
                  {finalScoreboard.length > 0 ? Math.round(finalScoreboard.reduce((sum, p) => sum + p.score, 0) / finalScoreboard.length) : 0}
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-white/60 text-sm">Best Score</div>
                <div className="text-white font-bold text-xl">{finalScoreboard[0]?.score || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
