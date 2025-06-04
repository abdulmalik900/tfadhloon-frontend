'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGameScreen() {
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  const text = {
    en: {
      title: "Join Game",
      subtitle: "Enter the game code to join",
      placeholder: "Enter game code",
      joinButton: "Join Game",
      joiningText: "Joining game...",
      invalidCode: "Invalid game code",
      backHome: "Back to Home"
    },
    ar: {
      title: "انضمام للعبة",
      subtitle: "أدخل رمز اللعبة للانضمام",
      placeholder: "أدخل رمز اللعبة",
      joinButton: "انضمام للعبة",
      joiningText: "جاري الانضمام...",
      invalidCode: "رمز اللعبة غير صحيح",
      backHome: "العودة للرئيسية"
    }
  };

  const handleJoinGame = async () => {
    if (gameCode.length >= 6) {
      setIsJoining(true);
      
      // Simulate joining process
      setTimeout(() => {
        setIsJoining(false);
        router.push(`/game/${gameCode.toUpperCase()}`);
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 8) {
      setGameCode(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 flex flex-col items-center justify-center p-6">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
        >
          {language === 'en' ? 'عربي' : 'English'}
        </button>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push('/')}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
        >
          <span>←</span>
          <span>{text[language].backHome}</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            {text[language].title}
          </h1>
          <p className="text-xl text-white/90">
            {text[language].subtitle}
          </p>
        </div>

        {/* Join Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl space-y-6">
          {/* Game Code Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Game Code
            </label>
            <input
              type="text"
              value={gameCode}
              onChange={handleInputChange}
              placeholder={text[language].placeholder}
              className="w-full text-center text-3xl font-bold px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors tracking-wider"
              maxLength="8"
            />
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinGame}
            disabled={gameCode.length < 6 || isJoining}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-200 ${
              gameCode.length >= 6 && !isJoining
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isJoining ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>{text[language].joiningText}</span>
              </div>
            ) : (
              <>🎮 {text[language].joinButton}</>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-white/90 text-sm">
            💡 Ask the host for the 6-8 character game code
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
