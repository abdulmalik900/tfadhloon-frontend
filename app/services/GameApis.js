const BASE_URL = 'https://backend.tfadhloon.com';

class GameAPI {
  // Validate game code
  static async validateGameCode(gameCode) {
    try {
      console.log('Validating game code:', gameCode);
      const response = await fetch(`${BASE_URL}/api/game/validate/${gameCode}`, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || `Failed to validate code (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Game code validation result:', data);
      return data;
    } catch (error) {
      console.error('Validate game code failed:', error);
      throw error;
    }
  }

  // Create new game room
  static async createGame(playerName) {
    try {
      console.log('Creating game with:', { playerName, BASE_URL });
      
      if (!playerName || playerName.trim().length === 0) {
        throw new Error('Player name is required');
      }
      
      if (playerName.trim().length > 20) {
        throw new Error('Player name must be 20 characters or less');
      }
      
      const response = await fetch(`${BASE_URL}/api/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          playerName: playerName.trim()
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `Failed to create game (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Game created successfully:', data);
      return data;
    } catch (error) {
      console.error('Create game failed:', error);
      
      // Re-throw with a more user-friendly message if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to game server');
      }
      
      throw error;
    }
  }

  // Join existing game room
  static async joinGame(gameCode, playerName) {
    try {
      console.log('Joining game with:', { gameCode, playerName, BASE_URL });
      
      if (!gameCode || gameCode.trim().length === 0) {
        throw new Error('Game code is required');
      }
      
      if (!playerName || playerName.trim().length === 0) {
        throw new Error('Player name is required');
      }
      
      if (playerName.trim().length > 20) {
        throw new Error('Player name must be 20 characters or less');
      }
      
      const response = await fetch(`${BASE_URL}/api/game/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          gameCode: gameCode.trim().toUpperCase(),
          playerName: playerName.trim()
        })
      });
      
      console.log('Join game response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        console.error('Join game API Error:', errorData);
        throw new Error(errorData.message || `Failed to join game (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Join game successful:', data);
      return data;
    } catch (error) {
      console.error('Join game failed:', error);
      
      // Re-throw with a more user-friendly message if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to game server');
      }
      
      throw error;
    }
  }

  // Get game state
  static async getGameState(gameCode) {
    try {
      console.log('Getting game state for:', gameCode, 'from:', BASE_URL);
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/state`, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('Game state response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || `Failed to get game state (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Game state data:', data);
      return data;
    } catch (error) {
      console.error('Get game state failed:', error);
      throw error;
    }
  }

  // Get current question
  static async getCurrentQuestion(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/question`, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to get question');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get question failed:', error);
      throw error;
    }
  }

  // Get leaderboard
  static async getLeaderboard(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/leaderboard`, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to get leaderboard');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get leaderboard failed:', error);
      throw error;
    }
  }

  // Submit prediction
  static async submitPrediction(gameCode, playerId, predictedChoice) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          playerId,
          predictedChoice
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to submit prediction');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Submit prediction failed:', error);
      throw error;
    }
  }

  // Submit answer
  static async submitAnswer(gameCode, playerId, answer) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          playerId,
          answer
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to submit answer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Submit answer failed:', error);
      throw error;
    }
  }

  // Leave game
  static async leaveGame(gameCode, playerId) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          playerId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to leave game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Leave game failed:', error);
      throw error;
    }
  }

  // Start game
  static async startGame(gameCode) {
    try {
      console.log('Starting game with:', { gameCode, BASE_URL });
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('Start game response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        console.error('Start game API Error:', errorData);
        throw new Error(errorData.message || `Failed to start game (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Start game successful:', data);
      return data;
    } catch (error) {
      console.error('Start game failed:', error);
      throw error;
    }
  }

  // Complete scoring
  static async completeScoring(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/complete-scoring`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to complete scoring');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Complete scoring failed:', error);
      throw error;
    }
  }

  // Show winner
  static async showWinner(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/show-winner`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to show winner');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Show winner failed:', error);
      throw error;
    }
  }

  // Complete game
  static async completeGame(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/game/${gameCode}/complete-game`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to complete game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Complete game failed:', error);
      throw error;
    }
  }
}

export default GameAPI;