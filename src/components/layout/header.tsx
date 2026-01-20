import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useSettingsStore } from '../../stores/settings-store';

interface HeaderProps {
  notificationCount?: number;
}

export function Header({ notificationCount = 0 }: HeaderProps) {
  const { t } = useTranslation();
  const { toggleSidebar } = useSettingsStore();

  return (
    <header className="sticky top-0 z-40">
      {/* Subtle Ethiopian accent line */}
      <div className="ethiopian-accent-line"></div>

      <div className="flex h-16 items-center justify-between bg-card px-4 lg:px-6 border-b border-border">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden rounded-md p-2 text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo with link to landing page */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            {/* ECSCS Logo - 50% larger (15x15 = 60px from 40px) */}
            <img
              src="/images/ecscs-logo.png"
              alt="ECSCS"
              className="h-15 w-15 object-contain"
              style={{ height: '60px', width: '60px' }}
            />

            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                {t('header.title')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('header.subtitle')}
              </p>
            </div>
          </Link>
        </div>

        {/* Center - Subtle decorative element (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-primary/30"></div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Edmonton 2026</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-accent/30"></div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Notification bell */}
          <button
            className="relative rounded-lg p-2 text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label={t('header.notifications')}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
