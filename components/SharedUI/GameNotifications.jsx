'use client';
import { useState, useEffect } from 'react';

const GameNotifications = ({ className = '' }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a new notification
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
    
    return id;
  };

  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Make addNotification available globally for other components
  useEffect(() => {
    window.showGameNotification = addNotification;
    return () => {
      delete window.showGameNotification;
    };
  }, []);

  const getNotificationStyle = (type) => {
    const baseStyle = 'bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl border-l-4 transform transition-all duration-300 ease-in-out';
    
    switch (type) {
      case 'success':
        return `${baseStyle} border-green-500 text-green-800`;
      case 'error':
        return `${baseStyle} border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyle} border-yellow-500 text-yellow-800`;
      case 'player-join':
        return `${baseStyle} border-blue-500 text-blue-800`;
      case 'player-leave':
        return `${baseStyle} border-orange-500 text-orange-800`;
      case 'game-event':
        return `${baseStyle} border-purple-500 text-purple-800`;
      default:
        return `${baseStyle} border-gray-500 text-gray-800`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'player-join':
        return '🎉';
      case 'player-leave':
        return '👋';
      case 'game-event':
        return '🎮';
      default:
        return 'ℹ️';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 space-y-3 ${className}`}>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`${getNotificationStyle(notification.type)} animate-slide-in-right`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {getNotificationIcon(notification.type)}
            </span>
            <div className="flex-1">
              <p className="font-medium text-sm leading-tight">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Export function for programmatic use
export const showNotification = (message, type = 'info', duration = 3000) => {
  // Make sure this is client-side only
  if (typeof window === 'undefined') {
    console.log('SSR Notification:', message);
    return null;
  }
  
  // Use window.showGameNotification if available
  if (window.showGameNotification) {
    return window.showGameNotification(message, type, duration);
  }
  
  console.log('Notification:', message);
  return null;
};

export default GameNotifications;
