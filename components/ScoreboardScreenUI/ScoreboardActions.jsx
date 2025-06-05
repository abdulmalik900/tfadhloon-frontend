'use client';
import { useState } from 'react';

export default function ScoreboardActions({ 
  onNextCycle, 
  currentCycle, 
  totalCycles, 
  isHost = false,
  gameState = null 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isLastCycle = currentCycle >= totalCycles;

  const handleContinue = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onNextCycle();
    } catch (error) {
      console.error('Error continuing game:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Progress Indicator */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">Game Progress</span>
          <span className="text-white/80 text-sm">{currentCycle}/{totalCycles}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full transition-all duration-1000"
            style={{ width: `${(currentCycle / totalCycles) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={handleContinue}
        disabled={isProcessing}
        className={`w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 ${
          isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-orange-600 hover:shadow-2xl hover:scale-105'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-600 border-t-transparent"></div>
            <span>Processing...</span>
          </div>
        ) : isLastCycle ? (
          <>🏆 View Final Scores</>
        ) : (
          <>🚀 Start Next Cycle</>
        )}
      </button>

      {/* Additional Info */}
      {!isLastCycle && (
        <div className="text-center">
          <p className="text-white/70 text-sm">
            {totalCycles - currentCycle} cycle{totalCycles - currentCycle !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}

      {/* Host Controls */}
      {isHost && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-lg">👑</span>
            <span className="text-white font-medium">Host Controls</span>
          </div>
          <p className="text-white/70 text-xs text-center">
            {isLastCycle 
              ? 'You can end the game or start a new one'
              : 'Click the button above to continue to the next cycle'
            }
          </p>
        </div>
      )}

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-4xl animate-pulse pointer-events-none">🎊</div>
      <div className="absolute top-32 right-16 text-3xl animate-bounce pointer-events-none" style={{ animationDelay: '0.5s' }}>🎈</div>
      <div className="absolute bottom-32 left-8 text-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-48 right-12 text-4xl animate-bounce pointer-events-none" style={{ animationDelay: '1.5s' }}>🌟</div>
    </div>
  );
}
