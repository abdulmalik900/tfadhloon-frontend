'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeScreen() {
  const [language, setLanguage] = useState('en'); // 'en' or 'ar'
  const router = useRouter();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const text = {
    en: {
      title: "TFADHLOON",
      subtitle: "Would You Rather?",
      createGame: "Create Game",
      joinGame: "Join Game",
      languageToggle: "عربي"
    },
    ar: {
      title: "تفضلون",
      subtitle: "ايش تفضلون؟",
      createGame: "إنشاء لعبة",
      joinGame: "انضمام للعبة",
      languageToggle: "English"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex flex-col items-center justify-center p-6">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLanguage}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
        >
          {text[language].languageToggle}
        </button>
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            {text[language].title}
          </h1>
          <p className="text-xl text-white/90 font-medium">
            {text[language].subtitle}
          </p>
        </div>

        {/* Game Buttons */}
        <div className="space-y-4">
          {/* Create Game Button */}
          <div 
            onClick={() => router.push('/create-game')}
            className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <span className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                {text[language].createGame}
              </span>
            </div>
          </div>

          {/* Join Game Button */}
          <div 
            onClick={() => router.push('/join-game')}
            className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <span className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                {text[language].joinGame}
              </span>
            </div>
          </div>
        </div>

        {/* Fun decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
