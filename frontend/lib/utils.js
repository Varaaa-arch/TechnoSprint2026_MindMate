// Date formatting utilities
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else {
    return formatDate(date);
  }
}

// Mood utilities
export const MOODS = {
  HAPPY: { emoji: '😊', label: 'Senang', color: 'bg-yellow-100', value: 5 },
  CALM: { emoji: '😌', label: 'Tenang', color: 'bg-green-100', value: 4 },
  NEUTRAL: { emoji: '😐', label: 'Biasa', color: 'bg-gray-100', value: 3 },
  SAD: { emoji: '😔', label: 'Sedih', color: 'bg-blue-100', value: 2 },
  ANXIOUS: { emoji: '😰', label: 'Cemas', color: 'bg-purple-100', value: 1 },
  ANGRY: { emoji: '😡', label: 'Marah', color: 'bg-red-100', value: 1 },
};

export function getMoodByLabel(label) {
  return Object.values(MOODS).find(mood => mood.label === label);
}

export function getMoodByEmoji(emoji) {
  return Object.values(MOODS).find(mood => mood.emoji === emoji);
}

export function calculateMoodScore(moods) {
  if (!moods || moods.length === 0) return 0;
  const total = moods.reduce((sum, mood) => sum + mood.value, 0);
  return (total / moods.length).toFixed(1);
}

// String utilities
export function truncate(str, length = 100) {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Validation utilities
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}

// Local storage utilities
export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
}

// Array utilities
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

export function sortByDate(array, key = 'date', ascending = false) {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

// Number utilities
export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatPercentage(num, decimals = 0) {
  return `${num.toFixed(decimals)}%`;
}

// Color utilities
export function getMoodColor(moodLabel) {
  const mood = getMoodByLabel(moodLabel);
  return mood ? mood.color : 'bg-gray-100';
}

// Chart utilities
export function generateChartData(moods, days = 7) {
  const today = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date).toISOString().split('T')[0];
      return moodDate === dateStr;
    });

    const avgScore = dayMoods.length > 0
      ? calculateMoodScore(dayMoods)
      : 0;

    data.push({
      date: dateStr,
      day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      value: avgScore * 20, // Convert to percentage
      count: dayMoods.length
    });
  }

  return data;
}

// Export all utilities as default
export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  MOODS,
  getMoodByLabel,
  getMoodByEmoji,
  calculateMoodScore,
  truncate,
  capitalize,
  isValidEmail,
  isValidPassword,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  groupBy,
  sortByDate,
  formatNumber,
  formatPercentage,
  getMoodColor,
  generateChartData,
};
