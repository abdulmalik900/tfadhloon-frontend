'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGameScreen() {
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [canStart, setCanStart] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  // Generate random game code on component mount
  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameCode(code);
  }, []);

  // Mock players joining (for UI demo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (players.length < 4) {
        const newPlayer = `Player ${players.length + 1}`;
        setPlayers(prev => [...prev, newPlayer]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [players.length]);

  useEffect(() => {
    setCanStart(players.length >= 2);
  }, [players.length]);

  const text = {
    en: {
      title: "Game Created!",
      gameCode: "Game Code",
      waitingForPlayers: "Waiting for players...",
      playersJoined: "Players Joined",
      startGame: "Start Game",
      needMorePlayers: "Need at least 2 players to start",
      shareCode: "Share this code with your friends"
    },
    ar: {
      title: "تم إنشاء اللعبة!",
      gameCode: "رمز اللعبة",
      waitingForPlayers: "في انتظار اللاعبين...",
      playersJoined: "اللاعبين المنضمين",
      startGame: "بدء اللعبة",
      needMorePlayers: "نحتاج لاعبين على الأقل للبدء",
      shareCode: "شارك هذا الرمز مع أصدقائك"
    }
  };

  const startGame = () => {
    if (canStart) {
      router.push(`/game/${gameCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 flex flex-col items-center justify-center p-6">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200"
        >
          {language === 'en' ? 'عربي' : 'English'}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            {text[language].title}
          </h1>
          <p className="text-white/80">
            {text[language].shareCode}
          </p>
        </div>

        {/* Game Code Display */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            {text[language].gameCode}
          </h2>
          <div className="text-6xl font-bold text-gray-800 tracking-wider mb-4">
            {gameCode}
          </div>
          <div className="text-sm text-gray-500">
            {text[language].shareCode}
          </div>
        </div>

        {/* Players List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            {text[language].playersJoined} ({players.length})
          </h3>
          
          {players.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-pulse">
                <div className="text-3xl mb-2">⏳</div>
                {text[language].waitingForPlayers}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium">{player}</span>
                  <div className="flex-1"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          {canStart ? (
            <button
              onClick={startGame}
              className="bg-white text-green-600 font-bold text-xl px-8 py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 w-full"
            >
              🎮 {text[language].startGame}
            </button>
          ) : (
            <div className="bg-white/50 text-gray-600 font-bold text-xl px-8 py-4 rounded-3xl w-full text-center">
              {text[language].needMorePlayers}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
