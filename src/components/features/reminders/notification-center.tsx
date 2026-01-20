import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { useReminderStore } from '../../../stores/reminder-store';
import { useTaskStore } from '../../../stores/task-store';
import { useNotifications } from '../../../hooks/use-notifications';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { Reminder } from '../../../types';

interface NotificationCenterProps {
  onNavigateToTask?: (taskId: string) => void;
  className?: string;
}

/**
 * NotificationCenter component - Bell icon dropdown showing recent notifications
 */
export function NotificationCenter({ onNavigateToTask, className }: NotificationCenterProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { reminders, markReminderSent, getUpcomingReminders } = useReminderStore();
  const { tasks } = useTaskStore();
  const { permission, requestPermission, isSupported } = useNotifications();

  // Get unsent reminders (notifications that haven't been acknowledged)
  const unsentReminders = reminders.filter((r) => !r.sent);
  const upcomingReminders = getUpcomingReminders();
  const unreadCount = unsentReminders.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Get task title by ID
   */
  const getTaskTitle = (taskId: string): string => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || t('reminders.unknownTask');
  };

  /**
   * Format reminder date as relative time
   */
  const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  /**
   * Handle clicking on a notification item
   */
  const handleNotificationClick = (reminder: Reminder) => {
    if (onNavigateToTask) {
      onNavigateToTask(reminder.taskId);
    }
    markReminderSent(reminder.id);
    setIsOpen(false);
  };

  /**
   * Mark all notifications as read
   */
  const handleMarkAllRead = () => {
    unsentReminders.forEach((reminder) => {
      markReminderSent(reminder.id);
    });
  };

  /**
   * Toggle dropdown
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handle enabling notifications
   */
  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Bell Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDropdown}
        className="relative"
        aria-label={t('header.notifications')}
      >
        {/* Bell Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {/* Badge Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-lg border border-border bg-card shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold">{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs"
              >
                {t('notifications.markAllRead')}
              </Button>
            )}
          </div>

          {/* Notification Permission Warning */}
          {isSupported && permission !== 'granted' && (
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">
                {t('notifications.enablePrompt')}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnableNotifications}
              >
                {t('notifications.enable')}
              </Button>
            </div>
          )}

          {/* Notification List */}
          <div className="overflow-y-auto max-h-72">
            {upcomingReminders.length === 0 && unsentReminders.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-muted-foreground">
                  {t('notifications.noNotifications')}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {/* Show upcoming reminders first */}
                {upcomingReminders.map((reminder) => (
                  <li key={reminder.id}>
                    <button
                      className={cn(
                        'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                        !reminder.sent && 'bg-primary/5'
                      )}
                      onClick={() => handleNotificationClick(reminder)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread indicator */}
                        {!reminder.sent && (
                          <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {getTaskTitle(reminder.taskId)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t('notifications.reminderDue')}{' '}
                            {formatRelativeTime(reminder.date)}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-1">
                            {reminder.type === 'browser'
                              ? t('reminders.typeBrowser')
                              : t('reminders.typeEmail')}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {(upcomingReminders.length > 0 || unsentReminders.length > 0) && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {t('notifications.clickToView')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
