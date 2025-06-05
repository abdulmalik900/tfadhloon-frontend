'use client';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';

export default function HomeUI({
  isConnected,
  recentGames,
  onQuickJoin,
  onClearHistory
}) {

  return (
    <>
      <BackgroundAnimations />
      
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🎮 Game Hub
          </h1>
          <p className="text-white/80 text-lg">
            Real-time multiplayer predictions
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
              : 'bg-red-500/20 text-red-100 border border-red-400/30'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            {isConnected ? 'Server Connected' : 'Server Disconnected'}
          </div>        </div>

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">
                🕒 Recent Games
              </h3>
              <button
                onClick={onClearHistory}
                className="text-white/60 hover:text-white/80 text-xs"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {recentGames.slice(0, 3).map((game, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/90 font-medium">{game.code}</div>
                      <div className="text-white/60 text-xs">{game.date}</div>
                    </div>
                    <button
                      onClick={() => onQuickJoin(game.code)}
                      className="bg-white/20 text-white text-xs px-3 py-1 rounded-lg hover:bg-white/30 transition-all duration-200"
                    >
                      Rejoin
                    </button>
                  </div>
                </div>
              ))}            </div>
          </div>
        )}
      </div>
    </>
  );
}
