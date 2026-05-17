// API client — sends Supabase access token when available

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

let authTokenGetter = null;

/** Register async function that returns current JWT (from AuthContext). */
export function setAuthTokenGetter(getter) {
  authTokenGetter = getter;
}

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (authTokenGetter) {
      try {
        const token = await authTokenGetter();
        if (token) headers.Authorization = `Bearer ${token}`;
      } catch {
        /* ignore */
      }
    }

    const config = { ...options, headers };

    const response = await fetch(url, config);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = body.detail || body.message || `HTTP ${response.status}`;
      const err = new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
      err.status = response.status;
      throw err;
    }

    return body;
  }

  async sendMessage(message) {
    return this.request("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async getChatHistory() {
    return this.request("/api/chat/history");
  }

  async saveMood({ mood, note, entry_date }) {
    return this.request("/api/mood", {
      method: "POST",
      body: JSON.stringify({ mood, note, entry_date }),
    });
  }

  async getMoodHistory(days = 30) {
    return this.request(`/api/mood/history?days=${days}`);
  }

  async getMoodStats() {
    return this.request("/api/mood/stats");
  }

  async getInsights() {
    return this.request("/api/insights");
  }

  async getWeeklyReport() {
    return this.request("/api/insights/weekly");
  }

  async getRecommendations() {
    return this.request("/api/insights/recommendations");
  }

  async getDailySummary() {
    return this.request("/api/insights/daily-summary");
  }

  async getMe() {
    return this.request("/api/auth/me");
  }
}

const api = new ApiClient();
export default api;

export const {
  sendMessage,
  getChatHistory,
  saveMood,
  getMoodHistory,
  getMoodStats,
  getInsights,
  getWeeklyReport,
  getRecommendations,
  getMe,
} = api;
