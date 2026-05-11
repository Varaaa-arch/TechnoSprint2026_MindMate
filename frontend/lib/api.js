// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Client
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chat endpoints
  async sendMessage(message, userId) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    });
  }

  async getChatHistory(userId) {
    return this.request(`/api/chat/history/${userId}`);
  }

  // Mood endpoints
  async saveMood(moodData) {
    return this.request('/api/mood', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  async getMoodHistory(userId, days = 30) {
    return this.request(`/api/mood/history/${userId}?days=${days}`);
  }

  async getMoodStats(userId) {
    return this.request(`/api/mood/stats/${userId}`);
  }

  // Insights endpoints
  async getInsights(userId) {
    return this.request(`/api/insights/${userId}`);
  }

  async getWeeklyReport(userId) {
    return this.request(`/api/insights/weekly/${userId}`);
  }

  async getRecommendations(userId) {
    return this.request(`/api/insights/recommendations/${userId}`);
  }
}

// Export singleton instance
const api = new ApiClient();
export default api;

// Export individual functions for convenience
export const {
  sendMessage,
  getChatHistory,
  saveMood,
  getMoodHistory,
  getMoodStats,
  getInsights,
  getWeeklyReport,
  getRecommendations,
} = api;
