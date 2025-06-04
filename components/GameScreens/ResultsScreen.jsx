'use client';
import { useState, useEffect } from 'react';
import { mockPlayers } from '@/data/mockData';

export default function ResultsScreen({ gameState, onNext }) {
  const [language, setLanguage] = useState('en');
  const [animationPhase, setAnimationPhase] = useState('loading');

  const currentPlayer = mockPlayers[gameState?.currentPlayerTurn || 0];
  const actualAnswer = gameState?.currentAnswer || 'A';
  
  // Mock prediction results
  const predictionResults = {
    correctPredictors: [
      { name: "Sara", avatar: "🎪", prediction: actualAnswer },
      { name: "Omar", avatar: "🎨", prediction: actualAnswer }
    ],
    wrongPredictors: [
      { name: "Layla", avatar: "🎭", prediction: actualAnswer === 'A' ? 'B' : 'A' }
    ]
  };

  const text = {
    en: {
      title: "Prediction Results!",
      chose: "chose",
      correctPredictions: "Correct Predictions",
      wrongPredictions: "Wrong Predictions",
      nobodyGotIt: "Nobody predicted correctly!",
      everyoneGotIt: "Everyone predicted correctly!",
      nextRound: "Next Round",
      pointsEarned: "+1 Point!",
      calculating: "Calculating results..."
    },
    ar: {
      title: "نتائج التوقعات!",
      chose: "اختار",
      correctPredictions: "التوقعات الصحيحة",
      wrongPredictions: "التوقعات الخاطئة",
      nobodyGotIt: "ما حد توقع صح!",
      everyoneGotIt: "الكل توقع صح!",
      nextRound: "الجولة التالية",
      pointsEarned: "+١ نقطة!",
      calculating: "جاري حساب النتائج..."
    }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase('revealing');
    }, 1500);

    const timer2 = setTimeout(() => {
      setAnimationPhase('complete');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getAnswerColor = (answer) => {
    return answer === 'A' ? 'from-purple-400 to-purple-600' : 'from-orange-400 to-orange-600';
  };

  const getAnswerText = (answer) => {
    return answer === 'A' ? 'Option A' : 'Option B';
  };

  if (animationPhase === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">{text[language].calculating}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          Results
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
        >
          {language === 'en' ? 'عربي' : 'English'}
        </button>
      </div>

      {/* Title */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          {text[language].title}
        </h1>
      </div>

      {/* Player's Choice */}
      <div className="px-6 mb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-xl text-center animate-bounce-in">
            <div className="text-4xl mb-2">{currentPlayer?.avatar || '🎯'}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {currentPlayer?.name || 'Player'}
            </h3>
            <p className="text-gray-600 mb-4">
              {text[language].chose}
            </p>
            <div className={`bg-gradient-to-r ${getAnswerColor(actualAnswer)} text-white py-3 px-6 rounded-2xl font-bold text-lg`}>
              {getAnswerText(actualAnswer)}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Correct Predictions */}
          {predictionResults.correctPredictors.length > 0 && (
            <div className="bg-green-500/20 backdrop-blur-sm rounded-3xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 text-center flex items-center justify-center">
                ✅ {text[language].correctPredictions}
              </h3>
              <div className="space-y-3">
                {predictionResults.correctPredictors.map((player, index) => (
                  <div 
                    key={index} 
                    className="bg-white/20 rounded-2xl p-4 flex items-center space-x-3 animate-bounce-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="text-2xl">{player.avatar}</div>
                    <span className="text-white font-medium flex-1">{player.name}</span>
                    <div className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-sm font-bold">
                      {text[language].pointsEarned}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wrong Predictions */}
          {predictionResults.wrongPredictors.length > 0 && (
            <div className="bg-red-500/20 backdrop-blur-sm rounded-3xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 text-center flex items-center justify-center">
                ❌ {text[language].wrongPredictions}
              </h3>
              <div className="space-y-3">
                {predictionResults.wrongPredictors.map((player, index) => (
                  <div 
                    key={index} 
                    className="bg-white/20 rounded-2xl p-4 flex items-center space-x-3 animate-bounce-in"
                    style={{ animationDelay: `${index * 0.2 + 0.5}s` }}
                  >
                    <div className="text-2xl">{player.avatar}</div>
                    <span className="text-white font-medium flex-1">{player.name}</span>
                    <div className="text-white/60 text-sm">
                      Predicted: {getAnswerText(player.prediction)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Messages */}
          {predictionResults.correctPredictors.length === 0 && (
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-3xl p-6 text-center">
              <div className="text-4xl mb-2">😱</div>
              <p className="text-white font-bold">
                {text[language].nobodyGotIt}
              </p>
            </div>
          )}

          {predictionResults.wrongPredictors.length === 0 && predictionResults.correctPredictors.length > 0 && (
            <div className="bg-gold-500/20 backdrop-blur-sm rounded-3xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-white font-bold">
                {text[language].everyoneGotIt}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {animationPhase === 'complete' && (
        <div className="p-6">
          <button
            onClick={onNext}
            className="w-full bg-white text-purple-600 font-bold text-xl py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            🚀 {text[language].nextRound}
          </button>
        </div>
      )}

      {/* Celebration Effects */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce">🎊</div>
      <div className="absolute top-32 right-16 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎈</div>
      <div className="absolute bottom-32 left-8 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
    </div>
  );
}
