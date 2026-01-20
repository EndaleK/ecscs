import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import am from './locales/am.json';

const resources = {
  en: { translation: en },
  am: { translation: am },
};

// Initialize i18next
i18n
  // Detect user language from browser
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,

    // Supported languages
    supportedLngs: ['en', 'am'],

    // Fallback language when translation is missing
    fallbackLng: 'en',

    // Default namespace
    defaultNS: 'translation',

    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language preference
      caches: ['localStorage'],
      // Key to store language in localStorage
      lookupLocalStorage: 'ecscs-language',
    },

    // Interpolation options
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },

    // React i18next options
    react: {
      useSuspense: true,
    },

    // Debug mode (disable in production)
    debug: import.meta.env.DEV,
  });

// Helper function to change language
export const changeLanguage = (lng: 'en' | 'am') => {
  return i18n.changeLanguage(lng);
};

// Helper function to get current language
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Helper function to get supported languages
export const getSupportedLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  ];
};

export default i18n;
