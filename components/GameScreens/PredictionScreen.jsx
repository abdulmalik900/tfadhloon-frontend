'use client';
import { useState } from 'react';
import { mockQuestions, mockPlayers } from '@/data/mockData';

export default function PredictionScreen({ gameState, currentPlayerId, onPredictionSubmit }) {
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const currentPlayer = mockPlayers[gameState?.currentPlayerTurn || 0];
  const currentQuestion = mockQuestions[gameState?.currentQuestion || 0];
  const isCurrentPlayerTurn = currentPlayerId === currentPlayer?.id;

  const text = {
    en: {
      title: "Make Your Prediction",
      subtitle: "What will",
      choose: "choose?",
      waitingFor: "Waiting for",
      toAnswer: "to answer...",
      yourTurn: "Your Turn to Answer!",
      yourTurnSub: "Everyone has made their predictions",
      lockPrediction: "Lock In Prediction",
      predictionLocked: "Prediction Locked!",
      waitingForOthers: "Waiting for other predictions...",
      tapToAnswer: "Tap your choice below"
    },
    ar: {
      title: "اعمل توقعك",
      subtitle: "ايش",
      choose: "بيختار؟",
      waitingFor: "في انتظار",
      toAnswer: "للإجابة...",
      yourTurn: "دورك للإجابة!",
      yourTurnSub: "الكل عمل توقعاته",
      lockPrediction: "تأكيد التوقع",
      predictionLocked: "تم تأكيد التوقع!",
      waitingForOthers: "في انتظار توقعات الآخرين...",
      tapToAnswer: "اختر إجابتك"
    }
  };

  const handlePredictionSelect = (option) => {
    if (!isSubmitted && !isCurrentPlayerTurn) {
      setSelectedPrediction(option);
    } else if (isCurrentPlayerTurn) {
      // Current player is answering
      onPredictionSubmit(option, true); // true indicates this is the actual answer
    }
  };

  const lockInPrediction = () => {
    if (selectedPrediction && !isSubmitted) {
      setIsSubmitted(true);
      onPredictionSubmit(selectedPrediction, false); // false indicates this is a prediction
    }
  };

  if (isCurrentPlayerTurn) {
    // Show answer screen for current player
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-500 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            Your Turn
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
          >
            {language === 'en' ? 'عربي' : 'English'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {text[language].yourTurn}
            </h1>
            <p className="text-xl text-white/90">
              {text[language].yourTurnSub}
            </p>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentQuestion?.[language]?.question || "Would you rather..."}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="w-full max-w-4xl space-y-6">
            <div
              onClick={() => handlePredictionSelect('A')}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
            >
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl flex-shrink-0">
                    A
                  </div>
                  <p className="text-xl text-white font-medium text-left flex-1">
                    {currentQuestion?.[language]?.optionA || "Option A"}
                  </p>
                  <div className="text-white text-2xl group-hover:scale-110 transition-transform">
                    👆
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => handlePredictionSelect('B')}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
            >
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-2xl flex-shrink-0">
                    B
                  </div>
                  <p className="text-xl text-white font-medium text-left flex-1">
                    {currentQuestion?.[language]?.optionB || "Option B"}
                  </p>
                  <div className="text-white text-2xl group-hover:scale-110 transition-transform">
                    👆
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm">
              👆 {text[language].tapToAnswer}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show prediction screen for other players
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          Prediction Phase
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
        >
          {language === 'en' ? 'عربي' : 'English'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {text[language].title}
          </h1>
          <p className="text-xl text-white/90">
            {text[language].subtitle} <strong>{currentPlayer?.name || 'Player'}</strong> {text[language].choose}
          </p>
        </div>

        {/* Current Player Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 text-center">
          <div className="text-4xl mb-2">{currentPlayer?.avatar || '🎯'}</div>
          <div className="text-white font-bold text-lg">{currentPlayer?.name || 'Player'}</div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentQuestion?.[language]?.question || "Would you rather..."}
          </h2>
        </div>

        {/* Prediction Options */}
        <div className="w-full max-w-4xl space-y-6 mb-8">
          <div
            onClick={() => handlePredictionSelect('A')}
            className={`cursor-pointer transform transition-all duration-200 hover:scale-105 ${
              selectedPrediction === 'A' ? 'ring-4 ring-white scale-105' : ''
            } ${isSubmitted ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                  A
                </div>
                <p className="text-lg text-white font-medium flex-1">
                  {currentQuestion?.[language]?.optionA || "Option A"}
                </p>
                {selectedPrediction === 'A' && (
                  <div className="text-white text-xl">✅</div>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={() => handlePredictionSelect('B')}
            className={`cursor-pointer transform transition-all duration-200 hover:scale-105 ${
              selectedPrediction === 'B' ? 'ring-4 ring-white scale-105' : ''
            } ${isSubmitted ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                  B
                </div>
                <p className="text-lg text-white font-medium flex-1">
                  {currentQuestion?.[language]?.optionB || "Option B"}
                </p>
                {selectedPrediction === 'B' && (
                  <div className="text-white text-xl">✅</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isSubmitted ? (
          <button
            onClick={lockInPrediction}
            disabled={!selectedPrediction}
            className={`w-full max-w-md py-4 px-6 rounded-3xl font-bold text-xl transition-all duration-200 ${
              selectedPrediction
                ? 'bg-white text-purple-600 hover:shadow-xl transform hover:scale-105'
                : 'bg-white/30 text-white/50 cursor-not-allowed'
            }`}
          >
            🔒 {text[language].lockPrediction}
          </button>
        ) : (
          <div className="w-full max-w-md py-4 px-6 rounded-3xl bg-green-500 text-white font-bold text-xl text-center">
            ✅ {text[language].predictionLocked}
            <div className="text-sm mt-1">
              {text[language].waitingForOthers}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
