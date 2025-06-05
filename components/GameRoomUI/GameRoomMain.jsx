'use client';
import PlayerList from '@/components/SharedUI/PlayerList';
import BackgroundAnimations from '@/components/SharedUI/BackgroundAnimations';
import RealTimeStatus from '@/components/SharedUI/RealTimeStatus';
import PlayerActivity from '@/components/SharedUI/PlayerActivity';

export default function GameRoomMain({
  gameCode,
  players = [],
  gameStarted = false,
  connectionStatus = 'connected',
  isHost = false
}) {

  return (
    <>
      <BackgroundAnimations />
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full mx-auto">        {/* Game Room Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            Game Room
          </h1>
        </div>

        {/* Connection and Player Status */}
        <RealTimeStatus 
          connectionStatus={connectionStatus}
          playerCount={players.length}
          maxPlayers={3}
          className="mb-6"
          players={players}
        />

        {/* Recent Player Activity */}
        <PlayerActivity players={players} maxPlayers={3} />

        {/* Game Status */}
        {gameStarted && (
          <div className="mb-6 text-center">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center text-green-100 space-x-3">
                <div className="animate-spin text-2xl">🚀</div>
                <div>
                  <span className="font-bold text-lg">Game Starting!</span>
                  <p className="text-green-200 text-sm mt-1">Get ready for an epic game!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl flex items-center space-x-2">
              <span>👥</span>
              <span>Players in Room</span>
            </h3>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
              {players.some(p => p.isHost) ? 
                `Host + ${players.filter(p => !p.isHost).length}/3` : 
                `${players.length}/3`}
            </div>
          </div>
          <PlayerList 
            players={players} 
            maxPlayers={3} 
            showHostControls={isHost} 
          />
        </div>

        {/* Waiting Message */}
        <div className="text-center text-white/80 bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="text-4xl mb-2">
            {gameStarted ? '🎯' : '⏳'}
          </div>
          <p className="text-lg font-medium">
            {gameStarted ? 'Get ready to play!' : isHost ? 'Waiting for more players to join...' : 'Waiting for the host to start the game...'}
          </p>
          <p className="text-white/60 text-sm mt-2">
            {gameStarted ? 'The game will begin shortly!' : 'You\'ll be notified when the game starts'}
          </p>
        </div>
      </div>
    </>
  );
}
