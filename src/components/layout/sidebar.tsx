import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Kanban,
  Calendar,
  Users,
  Heart,
  DollarSign,
  Settings,
  X,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settings-store';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  labelKey: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, labelKey: 'sidebar.dashboard' },
  { to: '/tasks', icon: <ListTodo className="h-5 w-5" />, labelKey: 'sidebar.tasks' },
  { to: '/kanban', icon: <Kanban className="h-5 w-5" />, labelKey: 'sidebar.kanban' },
  { to: '/calendar', icon: <Calendar className="h-5 w-5" />, labelKey: 'sidebar.calendar' },
  { to: '/budget', icon: <DollarSign className="h-5 w-5" />, labelKey: 'sidebar.budget' },
  { to: '/contacts', icon: <Users className="h-5 w-5" />, labelKey: 'sidebar.contacts' },
  { to: '/volunteers', icon: <Heart className="h-5 w-5" />, labelKey: 'sidebar.volunteers' },
  { to: '/settings', icon: <Settings className="h-5 w-5" />, labelKey: 'sidebar.settings' },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen } = useSettingsStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Subtle accent border on right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-secondary/20 to-accent/20"></div>

        {/* Main sidebar content */}
        <div className="h-full bg-card border-r border-border">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
            {/* Subtle accent line at top */}
            <div className="absolute top-0 left-0 right-0 ethiopian-accent-line"></div>

            <Link to="/" className="flex items-center gap-2 mt-1">
              <img
                src="/images/ecscs-logo.png"
                alt="ECSCS"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-semibold text-foreground">{t('header.title')}</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-foreground hover:bg-muted transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop header - refined divider style */}
          <div className="hidden lg:flex items-center justify-center py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Menu</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/30"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                {item.icon}
                <span>{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </nav>

          {/* Subtle footer accent */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
