"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameAPI from "@/app/services/GameApis";
import { getSocket } from "@/app/services/socket";
import { showNotification } from "@/components/SharedUI/GameNotifications";
import FinalUI from "./FinalUI";
import FinalActions from "./FinalActions";

export default function FinalMain({ gameCode }) {
  const router = useRouter();
  const [finalResults, setFinalResults] = useState(null);
  const [winner, setWinner] = useState(null);
  const [finalScoreboard, setFinalScoreboard] = useState([]);
  const [gameStats, setGameStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerStats, setPlayerStats] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [returnToMainTimer, setReturnToMainTimer] = useState(null);

  // Socket setup
  useEffect(() => {
    if (gameCode) {
      setupSocketConnection();
      fetchFinalResults();
    }

    // Cleanup function for timer
    return () => {
      if (returnToMainTimer) {
        clearTimeout(returnToMainTimer);
      }
    };
  }, [gameCode]);

  // Confetti effect
  useEffect(() => {
    if (winner) {
      setShowConfetti(true);

      // Display winner animation for exactly 10 seconds
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      // Return to main screen after exactly 10 seconds
      const mainScreenTimer = setTimeout(() => {
        router.push("/");
      }, 10000); // Exactly 10 seconds

      setReturnToMainTimer(mainScreenTimer);

      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(mainScreenTimer);
      };
    }
  }, [winner, router]);

  const setupSocketConnection = () => {
    const socket = getSocket();

    socket.on("finalScores", (data) => {
      setFinalResults(data.results);
      setFinalScoreboard(data.leaderboard || []);
      setWinner(data.winner);
      setGameStats(data.stats);
    });

    socket.on("winnerAnimation", (data) => {
      setWinner(data.winner);
      setFinalScoreboard(data.finalLeaderboard || []);
      setShowConfetti(true);

      // Auto-return to main screen after exactly 10 seconds
      const timer = setTimeout(() => {
        router.push("/");
      }, 10000); // Exactly 10 seconds

      setReturnToMainTimer(timer);
    });

    socket.on("gameCompleted", () => {
      // The game is completely finished, ready to return to main
      showNotification(
        "Game completed! Returning to main screen...",
        "success",
        2000
      );
    });

    socket.on("playerDisconnected", (data) => {
      if (data.leftPlayer) {
        showNotification(`${data.leftPlayer.name} left the game`, "info", 3000);
      }
    });

    return () => {
      socket.off("finalScores");
      socket.off("winnerAnimation");
      socket.off("gameCompleted");
      socket.off("playerDisconnected");
    };
  };

  const fetchFinalResults = async () => {
    try {
      setIsLoading(true);
      const response = await GameAPI.getLeaderboard(gameCode);

      if (response.status === "success") {
        setFinalResults(response.data.results);
        setFinalScoreboard(response.data.leaderboard || []);
        setWinner(response.data.winner);
        setGameStats(response.data.stats);
        setPlayerStats(response.data.playerStats || []);
      } else {
        setError(response.message || "Failed to load final results");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error("Error fetching final results:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGame = () => {
    router.push("/create-game");
  };

  const handleJoinNewGame = () => {
    router.push("/join-game");
  };

  const handleBackToHome = () => {
    // Disconnect from socket
    const socket = getSocket();
    socket.disconnect();
    router.push("/");
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Game Results",
          text: `I just finished a game! ${
            winner
              ? `${winner.name} won with ${winner.score} points!`
              : "Check out the results!"
          }`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Game Results - ${
        winner
          ? `${winner.name} won with ${winner.score} points!`
          : "Game completed!"
      }`;
      navigator.clipboard.writeText(shareText).then(() => {
        showNotification("Results copied to clipboard!", "success", 2000);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="animate-bounce absolute top-10 left-10 text-4xl">
            🎉
          </div>
          <div
            className="animate-bounce absolute top-20 right-20 text-4xl"
            style={{ animationDelay: "0.5s" }}
          >
            🎊
          </div>
          <div
            className="animate-bounce absolute bottom-20 left-20 text-4xl"
            style={{ animationDelay: "1s" }}
          >
            ✨
          </div>
          <div
            className="animate-bounce absolute bottom-10 right-10 text-4xl"
            style={{ animationDelay: "1.5s" }}
          >
            🏆
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl">
        <FinalUI
          finalResults={finalResults}
          winner={winner}
          finalScoreboard={finalScoreboard}
          gameStats={gameStats}
          isLoading={isLoading}
          error={error}
          playerStats={playerStats}
        />

        <FinalActions
          onNewGame={handleNewGame}
          onJoinNewGame={handleJoinNewGame}
          onBackToHome={handleBackToHome}
          onShareResults={handleShareResults}
        />
      </div>
    </div>
  );
}
