"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GameRoomMain from "@/components/GameRoomUI/GameRoomMain";
import { getSocket, joinRoom } from "@/app/services/socket";
import { useLocalStorageState } from "@/app/utils/localStorage";

export default function GameRoomPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameCode = searchParams.get("code") || "";

  const [players, setPlayers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");

  const [playerId, setPlayerId] = useLocalStorageState("playerId");
  const [playerName, setPlayerName] = useLocalStorageState("playerName");

  useEffect(() => {
    if (!gameCode) {
      router.push("/join-game");
      return;
    }

    const socket = getSocket();
    const handleConnect = () => {
      setConnectionStatus("connected");
      // Use joinRoom instead of rejoin-game to ensure all players get notified
      joinRoom(gameCode, playerId, playerName);
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    const handleReconnecting = () => {
      setConnectionStatus("reconnecting");
    };
    const handlePlayerUpdate = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    const handleRoomUpdate = (data) => {
      if (data.players) {
        setPlayers(data.players);
      }
    };

    const handleGameStart = () => {
      setGameStarted(true);
      setTimeout(() => {
        router.push(`/game/${gameCode}`);
      }, 2000);
    };

    const handleError = (errorMsg) => {
      setError(errorMsg);
      setTimeout(() => {
        router.push("/join-game");
      }, 3000);
    }; // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnecting", handleReconnecting);
    socket.on("player-update", handlePlayerUpdate);
    socket.on("roomUpdate", handleRoomUpdate);
    socket.on("game-start", handleGameStart);
    socket.on("gameStarted", handleGameStart);
    socket.on("game-error", handleError); // Clean up
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnecting", handleReconnecting);
      socket.off("player-update", handlePlayerUpdate);
      socket.off("roomUpdate", handleRoomUpdate);
      socket.off("game-start", handleGameStart);
      socket.off("gameStarted", handleGameStart);
      socket.off("game-error", handleError);
    };
  }, [gameCode, playerId, playerName, router]);

  const isHost = players.some((p) => p.id === playerId && p.isHost);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center max-w-md w-full border border-white/20 shadow-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-white/90 mb-4">{error}</p>
          <p className="text-white/70 text-sm">Redirecting to join page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
      <GameRoomMain
        gameCode={gameCode}
        players={players}
        gameStarted={gameStarted}
        connectionStatus={connectionStatus}
        isHost={isHost}
      />
    </div>
  );
}
