import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount — validate existing token
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const token = authService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authService.me();
        const me = res?.user ?? res;
        if (!cancelled) setUser(me);
      } catch (err) {
        if (!cancelled) {
          authService.clearToken();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await authService.signUp(email, password);
      if (res?.token) authService.setToken(res.token);
      setUser(res?.user ?? null);
      return res;
    } catch (err) {
      setError(err.message || 'Sign up failed');
      throw err;
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await authService.signIn(email, password);
      if (res?.token) authService.setToken(res.token);
      setUser(res?.user ?? null);
      return res;
    } catch (err) {
      setError(err.message || 'Sign in failed');
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}