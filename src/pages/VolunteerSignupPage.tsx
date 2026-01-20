import { useTranslation } from 'react-i18next';

export function VolunteerSignupPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {t('volunteerSignup.title')}
        </h1>
        <p className="mt-4 text-gray-600 text-center">
          {t('volunteerSignup.description')}
        </p>
      </div>
    </div>
  );
}
