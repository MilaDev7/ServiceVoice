import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — add common headers, logging in dev
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    const status = error.response?.status;

    if (import.meta.env.DEV) {
      console.error(`[API ERROR] ${status || 'NETWORK'}: ${message}`);
    }

    return Promise.reject({
      status,
      message,
      original: error,
    });
  }
);

export default api;