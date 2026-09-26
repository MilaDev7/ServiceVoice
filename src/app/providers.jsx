import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

const AppContext = createContext(null);

export const LANGUAGES = [
  { code: 'am', label: 'አማርኛ', short: 'አማ' },
  { code: 'om', label: 'Afaan Oromoo', short: 'OM' },
  { code: 'en', label: 'English', short: 'EN' },
];

export const WOREDAS = [
  { id: 'bole', name: 'Bole', city: 'Addis Ababa' },
  { id: 'yeka', name: 'Yeka', city: 'Addis Ababa' },
  { id: 'akaki', name: 'Akaki Kaliti', city: 'Addis Ababa' },
];

export function AppProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('sv_language', 'am');
  const [woredaId, setWoredaId] = useLocalStorage('sv_woreda', 'bole');
  const [theme, setTheme] = useLocalStorage('sv_theme', 'light');
  const [notifications, setNotifications] = useLocalStorage('sv_notifications', {
    voice: true,
    sms: false,
    push: true,
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const value = {
    language,
    setLanguage,
    woredaId,
    setWoredaId,
    theme,
    setTheme,
    notifications,
    setNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}