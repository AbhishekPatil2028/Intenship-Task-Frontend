import axios from 'axios';

// ✅ Vite uses import.meta.env, not process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if you're using cookies
});

// Request interceptor to add token
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

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/passport-login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth functions
export const loginUser = async (email, password) => {
  const response = await api.post('/api/passportauth/login', { email, password }); // Changed endpoint
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/passportauth/signup', userData); // Changed endpoint
  return response.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await api.post('/api/passportauth/logout', { refreshToken });
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getProtectedData = async () => {
  const response = await api.get('/api/auth/protected');
  return response.data;
};

export const getTokenInfo = async () => {
  const response = await api.get('/api/auth/check-token');
  return response.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export default api;