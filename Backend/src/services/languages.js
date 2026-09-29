export const SUPPORTED_LANGUAGES = ["en", "am", "om", "ti"];

export function assertLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    const error = new Error(`Unsupported language: ${language}`);
    error.statusCode = 400;
    throw error;
  }
  return language;
}

export function localized(record, language, field) {
  return record[`${field}${language === "en" ? "En" : language === "am" ? "Am" : language === "om" ? "Om" : "Ti"}`]
    || record[`${field}En`]
    || null;
}
