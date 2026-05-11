// Application constants

// App Info
export const APP_NAME = 'MindMate';
export const APP_TAGLINE = 'Teman AI untuk Kesehatan Mentalmu';
export const APP_VERSION = '1.0.0';

// Routes
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  MOOD: '/mood',
  DASHBOARD: '/dashboard',
};

// Mood Types
export const MOOD_TYPES = {
  HAPPY: 'Senang',
  CALM: 'Tenang',
  NEUTRAL: 'Biasa',
  SAD: 'Sedih',
  ANXIOUS: 'Cemas',
  ANGRY: 'Marah',
};

// Mood Emojis
export const MOOD_EMOJIS = {
  HAPPY: '😊',
  CALM: '😌',
  NEUTRAL: '😐',
  SAD: '😔',
  ANXIOUS: '😰',
  ANGRY: '😡',
};

// Mood Colors (Tailwind classes)
export const MOOD_COLORS = {
  HAPPY: 'bg-yellow-100 hover:bg-yellow-200',
  CALM: 'bg-green-100 hover:bg-green-200',
  NEUTRAL: 'bg-gray-100 hover:bg-gray-200',
  SAD: 'bg-blue-100 hover:bg-blue-200',
  ANXIOUS: 'bg-purple-100 hover:bg-purple-200',
  ANGRY: 'bg-red-100 hover:bg-red-200',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#4F46E5', // Indigo
  SECONDARY: '#9333EA', // Purple
  SUCCESS: '#10B981', // Green
  WARNING: '#F59E0B', // Yellow
  DANGER: '#EF4444', // Red
  INFO: '#3B82F6', // Blue
};

// Time Periods
export const TIME_PERIODS = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ID: 'mindmate_user_id',
  USER_PROFILE: 'mindmate_user_profile',
  CHAT_HISTORY: 'mindmate_chat_history',
  MOOD_HISTORY: 'mindmate_mood_history',
  PREFERENCES: 'mindmate_preferences',
  THEME: 'mindmate_theme',
};

// API Endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  CHAT_HISTORY: '/api/chat/history',
  MOOD: '/api/mood',
  MOOD_HISTORY: '/api/mood/history',
  MOOD_STATS: '/api/mood/stats',
  INSIGHTS: '/api/insights',
  WEEKLY_REPORT: '/api/insights/weekly',
  RECOMMENDATIONS: '/api/insights/recommendations',
};

// Message Types
export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Insights Categories
export const INSIGHT_CATEGORIES = {
  SLEEP: 'sleep',
  EXERCISE: 'exercise',
  STRESS: 'stress',
  SOCIAL: 'social',
  NUTRITION: 'nutrition',
  MINDFULNESS: 'mindfulness',
};

// Recommendation Types
export const RECOMMENDATION_TYPES = {
  MEDITATION: 'meditation',
  EXERCISE: 'exercise',
  JOURNALING: 'journaling',
  SOCIAL: 'social',
  SLEEP: 'sleep',
  BREATHING: 'breathing',
};

// Activity Icons
export const ACTIVITY_ICONS = {
  MEDITATION: '🧘‍♀️',
  EXERCISE: '🏃‍♂️',
  JOURNALING: '📝',
  SOCIAL: '👥',
  SLEEP: '😴',
  BREATHING: '🌬️',
  MUSIC: '🎵',
  READING: '📚',
  NATURE: '🌳',
  HOBBY: '🎨',
};

// Stats Labels
export const STATS_LABELS = {
  MOOD_AVERAGE: 'Mood Rata-rata',
  PRODUCTIVE_DAYS: 'Hari Produktif',
  STRESS_LEVEL: 'Tingkat Stres',
  SLEEP_QUALITY: 'Kualitas Tidur',
  POSITIVE_MOOD: 'Mood Positif',
  STREAK: 'Streak Pencatatan',
  MONTHLY_TREND: 'Tren Mood Bulanan',
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_NOTE_LENGTH: 500,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  SERVER_ERROR: 'Terjadi kesalahan server. Silakan coba lagi nanti.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  AUTH_ERROR: 'Sesi Anda telah berakhir. Silakan login kembali.',
  NOT_FOUND: 'Data yang Anda cari tidak ditemukan.',
  PERMISSION_DENIED: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MOOD_SAVED: 'Mood berhasil disimpan!',
  MESSAGE_SENT: 'Pesan berhasil dikirim!',
  PROFILE_UPDATED: 'Profil berhasil diperbarui!',
  SETTINGS_SAVED: 'Pengaturan berhasil disimpan!',
};

// Feature Flags (for development)
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: false,
  ENABLE_SOCIAL_SHARING: false,
  ENABLE_VOICE_INPUT: false,
};

// Social Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/mindmate',
  TWITTER: 'https://twitter.com/mindmate',
  INSTAGRAM: 'https://instagram.com/mindmate',
  LINKEDIN: 'https://linkedin.com/company/mindmate',
};

// Support Links
export const SUPPORT_LINKS = {
  FAQ: '/faq',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HELP: '/help',
};

// Export all constants as default
export default {
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
  ROUTES,
  MOOD_TYPES,
  MOOD_EMOJIS,
  MOOD_COLORS,
  CHART_COLORS,
  TIME_PERIODS,
  STORAGE_KEYS,
  API_ENDPOINTS,
  MESSAGE_TYPES,
  NOTIFICATION_TYPES,
  INSIGHT_CATEGORIES,
  RECOMMENDATION_TYPES,
  ACTIVITY_ICONS,
  STATS_LABELS,
  VALIDATION,
  PAGINATION,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  SOCIAL_LINKS,
  SUPPORT_LINKS,
};
