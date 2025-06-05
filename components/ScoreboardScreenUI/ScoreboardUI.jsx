'use client';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';

export default function ScoreboardUI({
  scoreboard,
  gameStats,
  isLoading,
  error,
  currentRound,
  totalRounds,
  isGameComplete
}) {

  if (isLoading) {
    return (
      <>
        <BackgroundAnimations />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-white text-lg">Loading scoreboard...</p>
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
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Scoreboard</h1>
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
            🏆 Scoreboard
          </h1>
          <div className="flex items-center justify-center space-x-4 text-white/80">
            <div className="bg-white/20 px-4 py-2 rounded-xl">
              Round {currentRound} of {totalRounds}
            </div>
            {isGameComplete && (
              <div className="bg-green-500/30 text-green-100 px-4 py-2 rounded-xl border border-green-400/30">
                🎉 Game Complete!
              </div>
            )}
          </div>
        </div>

        {/* Podium (Top 3) */}
        {scoreboard.length >= 3 && (
          <div className="mb-8">
            <div className="flex items-end justify-center space-x-4">
              {/* Second Place */}
              <div className="text-center">
                <div className="bg-gray-400/30 border border-gray-300/50 rounded-xl p-4 mb-2">
                  <div className="text-3xl mb-2">🥈</div>
                  <div className="font-bold text-gray-100">{scoreboard[1]?.name}</div>
                  <div className="text-2xl font-bold text-gray-100">{scoreboard[1]?.score}</div>
                </div>
                <div className="bg-gray-400/20 h-16 rounded-t-lg"></div>
              </div>

              {/* First Place */}
              <div className="text-center">
                <div className="bg-yellow-500/30 border border-yellow-400/50 rounded-xl p-6 mb-2 transform scale-110">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="font-bold text-yellow-100 text-lg">{scoreboard[0]?.name}</div>
                  <div className="text-3xl font-bold text-yellow-100">{scoreboard[0]?.score}</div>
                </div>
                <div className="bg-yellow-500/30 h-20 rounded-t-lg"></div>
              </div>

              {/* Third Place */}
              <div className="text-center">
                <div className="bg-orange-500/30 border border-orange-400/50 rounded-xl p-4 mb-2">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="font-bold text-orange-100">{scoreboard[2]?.name}</div>
                  <div className="text-2xl font-bold text-orange-100">{scoreboard[2]?.score}</div>
                </div>
                <div className="bg-orange-500/20 h-12 rounded-t-lg"></div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold text-xl text-center mb-4">
            📊 Full Rankings
          </h2>
          
          {scoreboard.map((player, index) => (
            <div key={player.id || index} className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
              index === 0 
                ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100 shadow-lg' 
                : index === 1
                ? 'bg-gray-400/20 border-gray-300/30 text-gray-100'
                : index === 2
                ? 'bg-orange-500/20 border-orange-400/30 text-orange-100'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
            }`}>
              <div className="flex items-center">
                <div className="text-2xl mr-4 min-w-[3rem] text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div>
                  <div className="font-semibold text-lg">{player.name}</div>
                  <div className="text-sm opacity-80">
                    {player.correctAnswers || 0} correct answers
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {player.score}
                </div>
                <div className="text-xs opacity-80">points</div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Statistics */}
        {gameStats && (
          <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 text-center">
              📈 Game Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white/60">Total Questions</div>
                <div className="text-white font-semibold text-lg">{gameStats.totalQuestions || currentRound}</div>
              </div>
              <div className="text-center">
                <div className="text-white/60">Average Score</div>
                <div className="text-white font-semibold text-lg">
                  {scoreboard.length > 0 ? Math.round(scoreboard.reduce((sum, p) => sum + p.score, 0) / scoreboard.length) : 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/60">Highest Score</div>
                <div className="text-white font-semibold text-lg">{scoreboard[0]?.score || 0}</div>
              </div>
              <div className="text-center">
                <div className="text-white/60">Players</div>
                <div className="text-white font-semibold text-lg">{scoreboard.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>Game Progress</span>
            <span>{currentRound}/{totalRounds} rounds</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentRound / totalRounds) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
