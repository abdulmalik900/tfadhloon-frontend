'use client';

export default function CreateGameActions({ 
  players, 
  onStartGame, 
  onBackToHome 
}) {
  const minPlayersToStart = 2;
  const maxPlayers = 4;
  const currentPlayers = players ? players.length : 0;

  const canStartGame = currentPlayers >= minPlayersToStart && currentPlayers <= maxPlayers;

  return (
    <div className="mt-8 w-full max-w-md space-y-4">
      {/* Start Game Button */}
      <button
        onClick={onStartGame}
        disabled={!canStartGame || currentPlayers > maxPlayers}
        className={`w-full font-bold text-xl py-4 rounded-3xl shadow-xl transform transition-all duration-200 ${
          canStartGame
            ? 'bg-white text-purple-600 hover:shadow-2xl hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {(() => {
          if (currentPlayers < minPlayersToStart) {
            return `Need ${minPlayersToStart - currentPlayers} more player(s) to start`;
          } else if (currentPlayers < maxPlayers) {
            return `🚀 Start Game (${currentPlayers}/${maxPlayers})`;
          } else if (currentPlayers === maxPlayers) {
            return `🚀 Room Full! Start Game`;
          } else { // currentPlayers > maxPlayers (should be prevented by server)
            return `Too many players! (${currentPlayers}/${maxPlayers})`;
          }
        })()}
      </button>

      {/* Back to Home Button */}
      <button
        onClick={onBackToHome}
        className="w-full bg-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
      >
        ← Back to Home
      </button>
    </div>
  );
}
