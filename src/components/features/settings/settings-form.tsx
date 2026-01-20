import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, Bell } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Language, Theme } from '@/types';

export function SettingsForm() {
  const { t, i18n } = useTranslation();
  const {
    language,
    theme,
    notificationsEnabled,
    notificationPermission,
    setLanguage,
    setTheme,
    setNotifications,
    requestNotificationPermission,
  } = useSettingsStore();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // Theme toggle is just UI for now - actual theme switching can be implemented later
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      // Request permission when enabling
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        setNotifications(true);
      }
    } else {
      setNotifications(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.language.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.language.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => handleLanguageChange('en')}
              className="flex-1"
            >
              English
            </Button>
            <Button
              variant={language === 'am' ? 'default' : 'outline'}
              onClick={() => handleLanguageChange('am')}
              className="flex-1"
            >
              {'\u12A0\u121B\u122D\u129B'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            {t('settings.theme.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.theme.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('light')}
              className="flex-1"
            >
              <Sun className="mr-2 h-4 w-4" />
              {t('settings.theme.light')}
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('dark')}
              className="flex-1"
            >
              <Moon className="mr-2 h-4 w-4" />
              {t('settings.theme.dark')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.notifications.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('settings.notifications.browserNotifications')}</p>
              <p className="text-sm text-muted-foreground">
                {notificationPermission === 'denied'
                  ? t('settings.notifications.permissionDenied')
                  : t('settings.notifications.permissionInfo')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              disabled={notificationPermission === 'denied'}
              onClick={handleNotificationToggle}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${notificationsEnabled ? 'bg-primary' : 'bg-gray-200'}
                ${notificationPermission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                  transition duration-200 ease-in-out
                  ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
