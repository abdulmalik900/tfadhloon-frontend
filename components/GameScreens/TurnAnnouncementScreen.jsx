'use client';
import { useState } from 'react';
import { mockQuestions, mockPlayers } from '@/data/mockData';

export default function TurnAnnouncementScreen({ gameState, onStartPredictions }) {
  const [language, setLanguage] = useState('en');
  
  const currentPlayer = mockPlayers[gameState?.currentPlayerTurn || 0];
  const currentQuestion = mockQuestions[gameState?.currentQuestion || 0];
  const cycleInfo = `Cycle ${gameState?.currentCycle || 1} of 3`;

  const text = {
    en: {
      title: "Player's Turn",
      subtitle: "Get ready to predict!",
      itsTurn: "'s Turn to Answer",
      question: "The Question",
      othersPredict: "Other players will predict what",
      willChoose: "will choose",
      startButton: "Start Predictions",
      cycle: "Cycle"
    },
    ar: {
      title: "دور اللاعب",
      subtitle: "استعدوا للتنبؤ!",
      itsTurn: " دوره للإجابة",
      question: "السؤال",
      othersPredict: "اللاعبين الآخرين سيتنبؤون بما سيختاره",
      willChoose: "",
      startButton: "بدء التنبؤات",
      cycle: "الجولة"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          {text[language].cycle} {gameState?.currentCycle || 1}/3
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
        >
          {language === 'en' ? 'عربي' : 'English'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {text[language].title}
          </h1>
          <p className="text-xl text-white/90">
            {text[language].subtitle}
          </p>
        </div>

        {/* Current Player Display */}
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md w-full animate-bounce-in">
          <div className="text-6xl mb-4">
            {currentPlayer?.avatar || '🎯'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {currentPlayer?.name || 'Player 1'}
          </h2>
          <p className="text-lg text-gray-600">
            {currentPlayer?.name || 'Player 1'}{text[language].itsTurn}
          </p>
        </div>

        {/* Question Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 max-w-2xl w-full">
          <h3 className="text-white font-bold text-lg mb-4 text-center">
            {text[language].question}
          </h3>
          <div className="text-center text-white/90 text-lg mb-6">
            {currentQuestion?.[language]?.question || "Would you rather..."}
          </div>
          
          {/* Options Preview */}
          <div className="space-y-4">
            <div className="bg-purple-400/50 rounded-2xl p-4 text-white text-center">
              <strong>A:</strong> {currentQuestion?.[language]?.optionA || "Option A"}
            </div>
            <div className="bg-orange-400/50 rounded-2xl p-4 text-white text-center">
              <strong>B:</strong> {currentQuestion?.[language]?.optionB || "Option B"}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-400/20 backdrop-blur-sm rounded-2xl p-6 text-center max-w-md">
          <p className="text-white font-medium">
            💡 {text[language].othersPredict} <strong>{currentPlayer?.name || 'Player'}</strong> {text[language].willChoose}
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartPredictions}
          className="bg-white text-purple-600 font-bold text-xl px-8 py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 w-full max-w-md"
        >
          🔮 {text[language].startButton}
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 text-4xl animate-float">⭐</div>
      <div className="absolute bottom-32 right-12 text-3xl animate-float" style={{ animationDelay: '1s' }}>🎯</div>
      <div className="absolute top-1/3 right-8 text-2xl animate-float" style={{ animationDelay: '2s' }}>🎪</div>
    </div>
  );
}
