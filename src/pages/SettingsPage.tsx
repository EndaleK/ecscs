import { useTranslation } from 'react-i18next';
import { Settings, Info, Database, Download, Upload } from 'lucide-react';
import { SettingsForm, NotificationSettings } from '@/components/features/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SettingsPage() {
  const { t } = useTranslation();

  const handleExportData = () => {
    // Placeholder for data export functionality
    console.log('Export data - coming soon');
    alert(t('settings.dataManagement.exportComingSoon'));
  };

  const handleImportData = () => {
    // Placeholder for data import functionality
    console.log('Import data - coming soon');
    alert(t('settings.dataManagement.importComingSoon'));
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6" />
          {t('settings.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('settings.description')}
        </p>
      </div>

      {/* Settings Form */}
      <section>
        <h2 className="text-lg font-semibold mb-4">{t('settings.generalSettings')}</h2>
        <SettingsForm />
      </section>

      {/* Notification Settings */}
      <section>
        <h2 className="text-lg font-semibold mb-4">{t('settings.notificationPreferences')}</h2>
        <NotificationSettings />
      </section>

      {/* About Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">{t('settings.about.title')}</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t('settings.about.ecscsTitle')}
            </CardTitle>
            <CardDescription>
              {t('settings.about.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{t('settings.about.aboutTitle')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.about.aboutDescription')}
              </p>
            </div>
            <div>
              <h4 className="font-medium">{t('settings.about.tournamentInfo')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.about.tournamentDescription')}
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                {t('settings.about.version')}: 1.0.0
              </p>
              <p className="text-xs text-muted-foreground">
                {t('settings.about.copyright')}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Data Management Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">{t('settings.dataManagement.title')}</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t('settings.dataManagement.title')}
            </CardTitle>
            <CardDescription>
              {t('settings.dataManagement.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('settings.dataManagement.export')}
              </Button>
              <Button
                variant="outline"
                onClick={handleImportData}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                {t('settings.dataManagement.import')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('settings.dataManagement.note')}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
