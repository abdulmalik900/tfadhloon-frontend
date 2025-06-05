// Socket.io client singleton for TFADHLOON
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://backend.tfadhloon.com';
let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Added polling as fallback
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 10000, // As per backend documentation
      autoConnect: true,
      forceNew: false,
      upgrade: true
    });

    // Enhanced connection logging
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('🔥 Socket connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('🔥 Socket reconnection error:', error);
    });
  }
  return socket;
}

// Function to disconnect and cleanup socket
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Function to check socket connection status
export function isSocketConnected() {
  return socket && socket.connected;
}

// Use as both named and default export
export default getSocket;
