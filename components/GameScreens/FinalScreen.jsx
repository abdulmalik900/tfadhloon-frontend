'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FinalScreen({ gameId }) {
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  const text = {
    en: {
      title: "Thanks for Playing!",
      subtitle: "Hope you had fun with TFADHLOON",
      gameCode: "Game Code",
      playAgain: "Play Again",
      newGame: "Create New Game",
      home: "Back to Home",
      share: "Share TFADHLOON",
      sponsor: "Sponsored by Amazing Brand",
      followUs: "Follow us for more fun games!"
    },
    ar: {
      title: "شكراً لكم على اللعب!",
      subtitle: "نتمنى أنكم استمتعتم مع تفضلون",
      gameCode: "رمز اللعبة",
      playAgain: "العب مرة أخرى",
      newGame: "إنشاء لعبة جديدة",
      home: "العودة للرئيسية",
      share: "شارك تفضلون",
      sponsor: "برعاية العلامة التجارية المذهلة",
      followUs: "تابعونا للمزيد من الألعاب الممتعة!"
    }
  };

  const handlePlayAgain = () => {
    router.push('/create-game');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TFADHLOON - Would You Rather Game',
        text: 'Play the most fun Would You Rather game!',
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          {text[language].gameCode}: {gameId}
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
        {/* Title Section */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            {text[language].title}
          </h1>
          <p className="text-xl text-white/90">
            {text[language].subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Play Again Button */}
          <button
            onClick={handlePlayAgain}
            className="w-full bg-white text-green-600 font-bold text-xl py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>🎮</span>
            <span>{text[language].playAgain}</span>
          </button>

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="w-full bg-white/20 backdrop-blur-sm text-white font-bold text-lg py-4 rounded-3xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>🏠</span>
            <span>{text[language].home}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>📱</span>
            <span>{text[language].share}</span>
          </button>
        </div>

        {/* Social/Follow Section */}
        <div className="text-center space-y-3">
          <p className="text-white/80 text-sm">
            {text[language].followUs}
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all cursor-pointer">
              📸
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all cursor-pointer">
              📱
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all cursor-pointer">
              🎵
            </div>
          </div>
        </div>

        {/* Sponsor Section (Optional) */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center max-w-sm">
          <p className="text-white/70 text-xs mb-2">
            {text[language].sponsor}
          </p>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-2xl mb-1">🍔</div>
            <p className="text-white text-sm font-medium">
              Amazing Restaurant
            </p>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-8 text-3xl animate-float">🎊</div>
      <div className="absolute top-1/3 right-12 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎈</div>
      <div className="absolute bottom-1/4 left-16 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-1/3 right-8 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
