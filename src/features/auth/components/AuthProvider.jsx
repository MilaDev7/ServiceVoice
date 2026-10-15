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
      const { user } = await authService.me();
      if (!cancelled) setUser(user);
    } catch (err) {
      if (!cancelled) {
        authService.clearTokens();
        setUser(null);
      }
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  };

  bootstrap();
  return () => { cancelled = true; };
}, []);

 const signUp = useCallback(async ({ name, email, password }) => {
  const res = await authService.signUp({ name, email, password });
  setUser(res.user);
  return res;
}, []);
const signIn = useCallback(async ({ email, password }) => {
  const res = await authService.signIn({ email, password });
  setUser(res.user);
  return res;
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