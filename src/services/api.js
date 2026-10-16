import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sv_auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (payload.success === true) return payload.data;
      return Promise.reject({
        status: response.status,
        message: payload.message || 'Request failed',
      });
    }
    return payload;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';

    // Auto-clear tokens on auth failures (401, 403)
    if (status === 401 || status === 403) {
      localStorage.removeItem('sv_auth_token');
      localStorage.removeItem('sv_refresh_token');
    }

    if (import.meta.env.DEV) {
      console.error(`[API ERROR] ${status || 'NETWORK'}: ${message}`);
    }

    return Promise.reject({ status, message, original: error });
  }
);

export default api;