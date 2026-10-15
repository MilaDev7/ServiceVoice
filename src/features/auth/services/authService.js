import api from '../../../services/api';

const TOKEN_KEY = 'sv_auth_token';
const REFRESH_TOKEN_KEY = 'sv_refresh_token';

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

  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token) => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (err) {
      console.warn('Failed to store refresh token:', err);
    }
  },

  clearTokens: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  // ─────────────────────────────────────────────
  // API calls
  // ─────────────────────────────────────────────
  signUp: async ({ name, email, password }) => {
    const res = await api.post('/auth/register', { name, email, password });
    // res is already unwrapped by axios interceptor (returns response.data)
    // But backend wraps in { success, data: { user, accessToken, refreshToken } }
    const { user, accessToken, refreshToken } = res.data;
    authService.setToken(accessToken);
    authService.setRefreshToken(refreshToken);
    return { user, accessToken, refreshToken };
  },

  signIn: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data;
    authService.setToken(accessToken);
    authService.setRefreshToken(refreshToken);
    return { user, accessToken, refreshToken };
  },

  refresh: async () => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await api.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefresh } = res.data;
    authService.setToken(accessToken);
    authService.setRefreshToken(newRefresh);
    return { accessToken };
  },

  signOut: async () => {
    // Backend has no /auth/logout endpoint — clear client-side only
    authService.clearTokens();
  },

  me: async () => {
    const res = await api.get('/auth/me');
    // Backend returns { success, data: { user } }
    return res.data;  // { user }
  },

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: ({ token, password }) =>
    api.post('/auth/reset-password', { token, password }),
};