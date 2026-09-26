import { useApp, LANGUAGES, WOREDAS } from '../../../app/providers';

export function usePreferences() {
  const app = useApp();

  const currentLanguage =
    LANGUAGES.find((l) => l.code === app.language) || LANGUAGES[0];
  const currentWoreda =
    WOREDAS.find((w) => w.id === app.woredaId) || WOREDAS[0];

  return {
    ...app,
    currentLanguage,
    currentWoreda,
  };
}