import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/settings-store';
import type { Language } from '../../types';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
      <Globe className="h-4 w-4 text-gray-500 ml-1" />
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          language === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('am')}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          language === 'am'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to Amharic"
      >
        አማ
      </button>
    </div>
  );
}
