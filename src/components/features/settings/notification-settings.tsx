import { useTranslation } from 'react-i18next';
import { Bell, Clock, Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore, type ReminderTime } from '@/stores/settings-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function NotificationSettings() {
  const { t } = useTranslation();
  const {
    notificationsEnabled,
    notificationPermission,
    defaultReminderTime,
    soundEnabled,
    setNotifications,
    setDefaultReminderTime,
    setSoundEnabled,
    requestNotificationPermission,
  } = useSettingsStore();

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        setNotifications(true);
      }
    } else {
      setNotifications(false);
    }
  };

  const reminderOptions: { value: ReminderTime; labelKey: string }[] = [
    { value: '1hour', labelKey: 'settings.notifications.reminder1Hour' },
    { value: '1day', labelKey: 'settings.notifications.reminder1Day' },
    { value: '1week', labelKey: 'settings.notifications.reminder1Week' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('settings.notifications.title')}
        </CardTitle>
        <CardDescription>
          {t('settings.notifications.preferencesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t('settings.notifications.enable')}</p>
            <p className="text-sm text-muted-foreground">
              {notificationPermission === 'denied'
                ? t('settings.notifications.permissionDenied')
                : t('settings.notifications.enableDescription')}
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

        {/* Default Reminder Time */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{t('settings.notifications.defaultReminderTime')}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('settings.notifications.defaultReminderDescription')}
          </p>
          <div className="flex flex-wrap gap-2">
            {reminderOptions.map((option) => (
              <Button
                key={option.value}
                variant={defaultReminderTime === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDefaultReminderTime(option.value)}
                disabled={!notificationsEnabled}
              >
                {t(option.labelKey)}
              </Button>
            ))}
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">{t('settings.notifications.sound')}</p>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.soundDescription')}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            disabled={!notificationsEnabled}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${soundEnabled ? 'bg-primary' : 'bg-gray-200'}
              ${!notificationsEnabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
