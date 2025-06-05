'use client';

export default function HomeActions({
  isConnected,
  onCreateGame,
  onJoinGame
}) {
  return (
    <div className="mt-6 w-full max-w-md space-y-4">
      {/* Create Game Button */}
      <button
        onClick={onCreateGame}
        disabled={!isConnected}
        className={`w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 ${
          isConnected
            ? 'bg-white text-purple-600 hover:shadow-2xl hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {!isConnected ? (
          '🔌 Connecting to Server...'
        ) : (
          '🎮 Create New Game'
        )}
      </button>

      {/* Join Game Button */}
      <button
        onClick={onJoinGame}
        disabled={!isConnected}
        className={`w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 ${
          isConnected
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-2xl hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {!isConnected ? (
          '🔌 Connecting to Server...'
        ) : (
          '🎯 Join Existing Game'
        )}
      </button>

      {/* Help Text */}
      <div className="text-center text-white/60 text-xs mt-4">
        {!isConnected ? (
          'Waiting for server connection...'
        ) : (
          'Ready to play! Choose an option above'
        )}
      </div>
    </div>
  );
}
