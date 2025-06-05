const BASE_URL = 'https://backend.tfadhloon.com';

class GameAPI {
  // Health check
  static async testConnection() {
    try {
      const response = await fetch(`${BASE_URL}/api/games/test`, {
        mode: 'cors',
        credentials: 'omit'
      });
      return await response.json();
    } catch (error) {
      console.error('API connection failed:', error);
      throw error;
    }
  }

  // Validate game code
  static async validateGameCode(gameCode) {
    try {
      console.log('Validating game code:', gameCode);
      const response = await fetch(`${BASE_URL}/api/games/validate/${gameCode}`, {
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
  static async createGame(playerName, maxPlayers = 4) {
    try {
      console.log('Creating game with:', { playerName, maxPlayers, BASE_URL });      const response = await fetch(`${BASE_URL}/api/games/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          playerName,
          maxPlayers
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `Failed to create game (${response.status})`);
      }
        const data = await response.json();
      console.log('Game created successfully:', data);
      console.log('Response data structure:', JSON.stringify(data, null, 2));
      return data;} catch (error) {
      console.error('Create game failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
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
        const response = await fetch(`${BASE_URL}/api/games/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          gameCode,
          playerName
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
      throw error;
    }
  }

  // Get room status
  static async getRoomStatus(gameCode) {
    try {      console.log('Getting room status for:', gameCode, 'from:', BASE_URL);
      const response = await fetch(`${BASE_URL}/api/games/${gameCode}`, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('Room status response status:', response.status);
      
      if (!response.ok) {
        let errorPayload;
        let errorMessage = `Failed to get room status. Server returned ${response.status}.`; // Default error message
        try {
          errorPayload = await response.json(); // Try to parse JSON first
          if (errorPayload && errorPayload.message) {
            errorMessage = errorPayload.message;
          }
          console.error('Room status API Error (JSON):', errorPayload);
        } catch (e) {
          // If JSON parsing fails, try to get text as a fallback
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
            console.error(`Room status API Error: Non-JSON response (Status ${response.status}):`, errorText);
          } catch (textError) {
            console.error(`Room status API Error: Could not read error response body (Status ${response.status}).`);
          }
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Room status data:', data);
      return data;
    } catch (error) {
      console.error('Get room status failed:', error);
      throw error;
    }
  }
  // Start the game
  static async startGame(gameCode, hostId) {
    try {
      console.log('Starting game with:', { gameCode, hostId, BASE_URL });
        const response = await fetch(`${BASE_URL}/api/games/${gameCode}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          hostId
        })
      });
      
      console.log('Start game response status:', response.status);
      console.log('Start game response ok:', response.ok);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = { message: `HTTP ${response.status} - ${response.statusText}` };
        }
        console.error('Start game API Error:', errorData);
        throw new Error(errorData.message || errorData.error || `Failed to start game (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Start game successful:', data);
      return data;
    } catch (error) {
      console.error('Start game failed:', error);
      throw error;
    }
  }

  // Leave game room
  static async leaveGame(gameCode, playerId) {
    try {
      const response = await fetch(`${BASE_URL}/api/games/${gameCode}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to leave game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Leave game failed:', error);
      throw error;
    }
  }

  // Submit predictions (corrected to match API spec)
  static async submitPrediction(gameCode, playerId, predictions) {
    try {
      const response = await fetch(`${BASE_URL}/api/games/${gameCode}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          playerId,
          predictions // should be an array of { targetPlayerId, predictedChoice }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || 'Failed to submit predictions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Submit predictions failed:', error);
      throw error;
    }
  }

  // Submit answer (corrected to match API spec)
  static async submitAnswer(gameCode, playerId, answer) {
    try {
      const response = await fetch(`${BASE_URL}/api/games/${gameCode}/answer`, {
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

  // Get leaderboard
  static async getLeaderboard(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/games/${gameCode}/leaderboard`, {
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

  // Get current question
  static async getCurrentQuestion(gameCode) {
    try {
      const response = await fetch(`${BASE_URL}/api/games/${gameCode}/question`, {
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
}

export default GameAPI;