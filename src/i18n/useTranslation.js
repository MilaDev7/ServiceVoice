import { useCallback } from 'react';
import { useApp } from '../app/providers';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useApp();

  const t = useCallback(
    (key, fallback) => {
      // 1. Try current language
      const value = translations[language]?.[key];

      // 2. Fallback to English
      if (value !== undefined) return value;
      const enValue = translations.en?.[key];
      if (enValue !== undefined) return enValue;

      // 3. Fallback to explicit fallback, then key itself
      return fallback ?? key;
    },
    [language]
  );

  return { t, language };
}