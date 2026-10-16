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
  // API calls (interceptor already unwraps { success, data })
  // ─────────────────────────────────────────────
  signUp: async ({ name, email, password }) => {
    const res = await api.post('/auth/register', { name, email, password });
    // res is already: { user, accessToken, refreshToken }
    const { user, accessToken, refreshToken } = res;
    authService.setToken(accessToken);
    authService.setRefreshToken(refreshToken);
    return { user, accessToken, refreshToken };
  },

  signIn: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res;
    authService.setToken(accessToken);
    authService.setRefreshToken(refreshToken);
    return { user, accessToken, refreshToken };
  },

  refresh: async () => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await api.post('/auth/refresh', { refreshToken });
    // res: { accessToken, refreshToken }
    authService.setToken(res.accessToken);
    if (res.refreshToken) authService.setRefreshToken(res.refreshToken);
    return res;
  },

  signOut: async () => {
    authService.clearTokens();
  },

  me: async () => {
    const res = await api.get('/auth/me');
    // res: { user }
    return res;
  },

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: ({ token, password }) =>
    api.post('/auth/reset-password', { token, password }),
};