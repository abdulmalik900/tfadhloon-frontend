'use client';

const ResultsActions = ({ 
  animationPhase = 'loading',
  onNext,
  gameState,
  className = '' 
}) => {
  const isComplete = animationPhase === 'complete';
  const currentRound = gameState?.currentRound || 1;
  const totalRounds = gameState?.totalRounds || 5;
  const isLastRound = currentRound >= totalRounds;

  if (!isComplete) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="text-white/60 text-sm">
            Calculating results...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-4 ${className}`}>
      {/* Progress indicator */}
      <div className="text-center mb-4">
        <div className="text-white/80 text-sm mb-2">
          Round {currentRound} of {totalRounds}
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 max-w-md mx-auto">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full bg-white text-purple-600 font-bold text-xl py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
        style={{ animationDelay: '1s' }}
      >
        {isLastRound ? (
          <span className="flex items-center justify-center">
            <span className="mr-2">🏆</span>
            View Final Results
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2">🚀</span>
            Next Round
          </span>
        )}
      </button>

      {/* Additional info */}
      <div className="text-center text-white/60 text-sm">
        {isLastRound 
          ? 'Ready to see who won the game?' 
          : `${totalRounds - currentRound} rounds remaining`
        }
      </div>
    </div>
  );
};

export default ResultsActions;
