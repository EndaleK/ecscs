import { useEffect, useCallback, useRef } from 'react';
import { isPast, isBefore, addMinutes } from 'date-fns';
import { useReminderStore } from '../stores/reminder-store';
import { useTaskStore } from '../stores/task-store';
import { useNotifications } from './use-notifications';
import type { Reminder } from '../types';

interface UseRemindersOptions {
  checkIntervalMs?: number; // Default: 60000 (1 minute)
  enabled?: boolean; // Default: true
}

interface UseRemindersReturn {
  dueReminders: Reminder[];
  upcomingReminders: Reminder[];
  checkForDueReminders: () => void;
  dismissReminder: (id: string) => void;
}

/**
 * Custom hook for reminder management
 * Periodically checks for due reminders and triggers browser notifications
 */
export function useReminders(options: UseRemindersOptions = {}): UseRemindersReturn {
  const { checkIntervalMs = 60000, enabled = true } = options;

  const { reminders, markReminderSent, getUpcomingReminders } = useReminderStore();
  const { tasks } = useTaskStore();
  const { sendNotification, permission } = useNotifications();

  const lastCheckRef = useRef<Date>(new Date());

  /**
   * Get task title by ID
   */
  const getTaskTitle = useCallback(
    (taskId: string): string => {
      const task = tasks.find((t) => t.id === taskId);
      return task?.title || 'Unknown Task';
    },
    [tasks]
  );

  /**
   * Get reminders that are due (past reminder date, not yet sent)
   */
  const getDueReminders = useCallback((): Reminder[] => {
    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.date);
      return !reminder.sent && isPast(reminderDate);
    });
  }, [reminders]);

  /**
   * Check for due reminders and trigger notifications
   */
  const checkForDueReminders = useCallback(() => {
    if (permission !== 'granted') {
      return;
    }

    const now = new Date();
    const dueReminders = reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.date);
      // Check if reminder is due (in the past) and not sent
      // Also check if it became due since last check (within the check window)
      return (
        !reminder.sent &&
        isPast(reminderDate) &&
        isBefore(reminderDate, addMinutes(now, 1))
      );
    });

    dueReminders.forEach((reminder) => {
      const taskTitle = getTaskTitle(reminder.taskId);

      // Send browser notification
      if (reminder.type === 'browser') {
        sendNotification(
          'Task Reminder',
          `Reminder: ${taskTitle}`,
          '/favicon.ico'
        );
      }

      // Mark reminder as sent
      markReminderSent(reminder.id);
    });

    lastCheckRef.current = now;
  }, [reminders, permission, getTaskTitle, sendNotification, markReminderSent]);

  /**
   * Dismiss a reminder (mark as sent without notification)
   */
  const dismissReminder = useCallback(
    (id: string) => {
      markReminderSent(id);
    },
    [markReminderSent]
  );

  // Set up periodic check for due reminders
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial check
    checkForDueReminders();

    // Set up interval for periodic checks
    const intervalId = setInterval(() => {
      checkForDueReminders();
    }, checkIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, checkIntervalMs, checkForDueReminders]);

  // Get due and upcoming reminders for return value
  const dueReminders = getDueReminders();
  const upcomingReminders = getUpcomingReminders();

  return {
    dueReminders,
    upcomingReminders,
    checkForDueReminders,
    dismissReminder,
  };
}
