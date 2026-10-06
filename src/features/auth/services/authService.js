import api from '../../../services/api';

const TOKEN_KEY = 'sv_auth_token';

export const authService = {
  // ─────────────────────────────────────────────
  // Token storage
  // ─────────────────────────────────────────────
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.warn('Failed to store auth token:', err);
    }
  },

  clearToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  // ─────────────────────────────────────────────
  // API calls
  // ─────────────────────────────────────────────
  signUp: (email, password) =>
    api.post('/auth/signup', { email, password }),

  signIn: (email, password) =>
    api.post('/auth/signin', { email, password }),

  signOut: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Server logout failed, clearing local token anyway');
    } finally {
      authService.clearToken();
    }
  },

  me: () => api.get('/auth/me'),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }),
};