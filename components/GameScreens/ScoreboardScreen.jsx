'use client';
import { useState } from 'react';

export default function ScoreboardScreen({ gameState, onNextCycle }) {
  const [language, setLanguage] = useState('en');

  // Mock updated scoreboard data based on predictions
  const players = [
    { name: "Ahmed", score: 4, matches: "4/6", avatar: "🎯" },
    { name: "Sara", score: 3, matches: "3/6", avatar: "🎪" },
    { name: "Omar", score: 2, matches: "2/6", avatar: "🎨" },
    { name: "Layla", score: 1, matches: "1/6", avatar: "🎭" },
  ];

  const currentCycle = gameState?.currentCycle || 1;
  const totalCycles = gameState?.totalCycles || 3;
  const isLastCycle = currentCycle >= totalCycles;

  const text = {
    en: {
      title: "Leaderboard",
      subtitle: "Prediction Champions!",
      cycle: "Cycle",
      of: "of",
      correctPredictions: "correct predictions",
      winner: "Leading!",
      questionsAnswered: `Cycle ${currentCycle} Complete`,
      nextCycle: "Start Next Cycle",
      finalScores: "View Final Scores",
      predictionMaster: "Prediction Master!"
    },
    ar: {
      title: "المتصدرين",
      subtitle: "أبطال التوقعات!",
      cycle: "الجولة",
      of: "من",
      correctPredictions: "توقع صحيح",
      winner: "متصدر!",
      questionsAnswered: `انتهت الجولة ${currentCycle}`,
      nextCycle: "بدء الجولة التالية",
      finalScores: "عرض النتائج النهائية",
      predictionMaster: "ملك التوقعات!"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          {text[language].cycle} {currentCycle}/{totalCycles}
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
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          {text[language].title}
        </h1>
        <p className="text-xl text-white/90">
          {text[language].subtitle}
        </p>
        <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-white font-medium">
            {text[language].questionsAnswered}
          </span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto space-y-4">
          {players.map((player, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-6 shadow-xl transform transition-all duration-200 hover:scale-105 ${
                index === 0 ? 'scale-105 ring-4 ring-yellow-300' : ''
              }`}
            >
              {/* Winner crown */}
              {index === 0 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
                  👑
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                {/* Position number */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700' :
                  index === 2 ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' :
                  'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="text-3xl">
                  {player.avatar}
                </div>

                {/* Player info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg text-gray-800">
                      {player.name}
                    </h3>
                    {index === 0 && (
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        {text[language].winner}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {player.matches} {text[language].correctPredictions}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {player.score}
                  </div>
                  <div className="text-xs text-gray-500">
                    points
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
                    'bg-gradient-to-r from-gray-300 to-gray-400'
                  }`}
                  style={{ width: `${(player.score / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Celebration elements */}
        <div className="text-center mt-8">
          <div className="text-6xl mb-4 animate-bounce">
            🎉
          </div>
          <p className="text-white text-lg">
            {text[language].predictionMaster}
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6">
        <button
          onClick={onNextCycle}
          className="w-full bg-white text-orange-600 font-bold text-xl py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          {isLastCycle ? (
            <>🏆 {text[language].finalScores}</>
          ) : (
            <>🚀 {text[language].nextCycle}</>
          )}
        </button>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-4xl animate-pulse">🎊</div>
      <div className="absolute top-32 right-16 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎈</div>
      <div className="absolute bottom-32 left-8 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-48 right-12 text-4xl animate-bounce" style={{ animationDelay: '1.5s' }}>🌟</div>
    </div>
  );
}
