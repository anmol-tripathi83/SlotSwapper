import axios from 'axios';

// Debug environment variables
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All env variables:', import.meta.env);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('Final API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add request logging for debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.baseURL);
  return config;
});

// Add response logging for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log('API Response Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;