import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useSettingsStore } from '../../stores/settings-store';

interface MainLayoutProps {
  notificationCount?: number;
}

export function MainLayout({ notificationCount = 0 }: MainLayoutProps) {
  const { i18n } = useTranslation();
  const { language, sidebarOpen } = useSettingsStore();

  // Sync i18n language with settings store on mount
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      // On desktop, sidebar is always visible via CSS
      // On mobile, it's controlled by state
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex h-screen bg-background">
      {/* Ethiopian traditional pattern background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/ethiopian-traditional-pattern-color.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
        }}
      />
      {/* Subtle gradient overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/80 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header notificationCount={notificationCount} />

        {/* Page content */}
        <main
          className={`flex-1 overflow-auto p-4 lg:p-6 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
