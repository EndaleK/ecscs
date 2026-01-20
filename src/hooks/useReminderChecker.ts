import { useEffect, useCallback } from 'react';
import { useReminderStore } from '@/stores/reminder-store';
import { useTaskStore } from '@/stores/task-store';

const CHECK_INTERVAL_MS = 60000; // Check every minute

export function useReminderChecker() {
  const { reminders, markReminderSent } = useReminderStore();
  const { tasks } = useTaskStore();

  const getTaskTitle = useCallback((taskId: string): string => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || 'Reminder';
  }, [tasks]);

  const checkReminders = useCallback(() => {
    const now = new Date();

    reminders.forEach((reminder) => {
      if (reminder.sent) return;

      const reminderDate = new Date(reminder.date);

      // Check if reminder time has passed or is within the next minute
      if (reminderDate <= now) {
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('ECSCS Reminder', {
            body: getTaskTitle(reminder.taskId),
            icon: '/vite.svg',
          });
        }

        // Mark as sent
        markReminderSent(reminder.id);
      }
    });
  }, [reminders, markReminderSent, getTaskTitle]);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initial check
    checkReminders();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkReminders, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkReminders]);
}
