import { useTranslation } from 'react-i18next';

export function TasksPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('navigation.tasks')}
      </h1>
      <p className="mt-2 text-gray-600">
        {t('tasks.description')}
      </p>
    </div>
  );
}
