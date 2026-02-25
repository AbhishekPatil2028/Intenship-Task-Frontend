import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add access token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('Session expired');
        }

        // Get new access token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken } = response.data;

        // Save new token
        localStorage.setItem('accessToken', accessToken);

        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens on refresh failure
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        
        throw new Error('Session expired. Please login again.');
      }
    }

    return Promise.reject(error);
  }
);

// Get protected welcome message
export const getWelcome = async () => {
  try {
    const response = await api.get('/auth/protected');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'API call failed';
    throw new Error(errorMessage);
  }
};

// Check token status
export const checkTokenStatus = async () => {
  try {
    const response = await api.get('/auth/check-token');
    return response.data;
  } catch (error) {
    throw new Error('Token is invalid or expired');
  }
};

// Get API health
export const getApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/health`);
    return response.data;
  } catch (error) {
    throw new Error('API is not responding');
  }
};