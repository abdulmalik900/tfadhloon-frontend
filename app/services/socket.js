// Socket.io client singleton for TFADHLOON
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://backend.tfadhloon.com'; // Production backend URL
let socket;

function getSocket() {
  if (!socket || socket.disconnected) {
    console.log('Creating socket connection to:', SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
}

// Socket event emitters (Client to Server)
export function joinRoom(gameCode, playerId, playerName) {
  const socket = getSocket();
  socket.emit('joinRoom', {
    gameCode,
    playerId,
    playerName
  });
}

export function submitPrediction(gameCode, playerId, predictedChoice) {
  const socket = getSocket();
  socket.emit('submitPrediction', {
    gameCode,
    playerId,
    predictedChoice
  });
}

export function submitAnswer(gameCode, playerId, answer) {
  const socket = getSocket();
  socket.emit('submitAnswer', {
    gameCode,
    playerId,
    answer
  });
}

// Socket event listeners (Server to Client)
export function setupSocketListeners(callbacks) {
  const socket = getSocket();
  
  // Room updates
  socket.on('roomUpdate', callbacks.onRoomUpdate || (() => {}));
  
  // Game flow events
  socket.on('gameStarted', callbacks.onGameStarted || (() => {}));
  socket.on('roundStarted', callbacks.onRoundStarted || (() => {}));
  socket.on('answeringPhase', callbacks.onAnsweringPhase || (() => {}));
  socket.on('roundResults', callbacks.onRoundResults || (() => {}));
  socket.on('finalScores', callbacks.onFinalScores || (() => {}));
  
  // Real-time updates
  socket.on('predictionUpdate', callbacks.onPredictionUpdate || (() => {}));
  socket.on('playerDisconnected', callbacks.onPlayerDisconnected || (() => {}));
  
  return () => {
    // Cleanup function
    socket.off('roomUpdate');
    socket.off('gameStarted');
    socket.off('roundStarted');
    socket.off('answeringPhase');
    socket.off('roundResults');
    socket.off('finalScores');
    socket.off('predictionUpdate');
    socket.off('playerDisconnected');
  };
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function isSocketConnected() {
  return socket && socket.connected;
}

export { getSocket };
export default getSocket;
