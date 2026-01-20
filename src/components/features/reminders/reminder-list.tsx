import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useReminderStore } from '../../../stores/reminder-store';
import { useTaskStore } from '../../../stores/task-store';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
import type { Reminder } from '../../../types';

interface ReminderListProps {
  onEditReminder?: (reminder: Reminder) => void;
  className?: string;
}

/**
 * ReminderList component - displays upcoming reminders with edit/delete/dismiss actions
 */
export function ReminderList({ onEditReminder, className }: ReminderListProps) {
  const { t } = useTranslation();
  const { reminders, deleteReminder, markReminderSent, getUpcomingReminders } = useReminderStore();
  const { tasks } = useTaskStore();

  const upcomingReminders = getUpcomingReminders();
  const sentReminders = reminders.filter((r) => r.sent);

  /**
   * Get task title by ID
   */
  const getTaskTitle = (taskId: string): string => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || t('reminders.unknownTask');
  };

  /**
   * Format reminder date for display
   */
  const formatReminderDate = (date: Date): string => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  /**
   * Handle edit reminder
   */
  const handleEdit = (reminder: Reminder) => {
    if (onEditReminder) {
      onEditReminder(reminder);
    }
  };

  /**
   * Handle delete reminder
   */
  const handleDelete = (id: string) => {
    deleteReminder(id);
  };

  /**
   * Handle dismiss reminder (mark as sent)
   */
  const handleDismiss = (id: string) => {
    markReminderSent(id);
  };

  if (reminders.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle>{t('reminders.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {t('reminders.noReminders')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>{t('reminders.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              {t('reminders.upcoming')}
            </h3>
            <ul className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <li
                  key={reminder.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {getTaskTitle(reminder.taskId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatReminderDate(reminder.date)}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-1">
                      {reminder.type === 'browser'
                        ? t('reminders.typeBrowser')
                        : t('reminders.typeEmail')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(reminder)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(reminder.id)}
                    >
                      {t('reminders.dismiss')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sent/Dismissed Reminders */}
        {sentReminders.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              {t('reminders.sent')}
            </h3>
            <ul className="space-y-3">
              {sentReminders.slice(0, 5).map((reminder) => (
                <li
                  key={reminder.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-muted-foreground">
                      {getTaskTitle(reminder.taskId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatReminderDate(reminder.date)}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground mt-1">
                      {t('reminders.sentLabel')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
