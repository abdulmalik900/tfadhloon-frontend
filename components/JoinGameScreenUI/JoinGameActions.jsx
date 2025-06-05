'use client';
import { useRouter } from 'next/navigation';

const JoinGameActions = ({ 
  gameCode,
  gameStarted = false,
  onLeaveGame,
  isJoined = false,
  className = '' 
}) => {
  const router = useRouter();

  const handleEnterGame = () => {
    router.push(`/game/${gameCode}`);
  };

  const handleLeaveGame = () => {
    if (onLeaveGame) {
      onLeaveGame();
    } else {
      // Default behavior - redirect to home
      router.push('/');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // If joined, show joined game actions
  if (isJoined) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Enter Game Button */}
        <button
          onClick={handleEnterGame}
          disabled={gameStarted}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
            gameStarted 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
              : 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg'
          }`}
        >
          {gameStarted ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin mr-2">🔄</div>
              Starting...
            </span>
          ) : (
            '🎮 Enter Game Room'
          )}
        </button>
        
        {/* Leave Game Button */}
        <button
          onClick={handleLeaveGame}
          disabled={gameStarted}
          className="w-full bg-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">←</span>
            Leave Game
          </span>
        </button>
      </div>
    );
  }

  // If not joined, show back button
  return (
    <div className={`absolute top-6 left-6 ${className}`}>
      <button
        onClick={handleBackToHome}
        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>
    </div>
  );
};

export default JoinGameActions;