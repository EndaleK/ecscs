import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format, addHours } from 'date-fns';
import { useReminderStore } from '../../../stores/reminder-store';
import { useTaskStore } from '../../../stores/task-store';
import { useNotifications } from '../../../hooks/use-notifications';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
import type { Reminder, ReminderType } from '../../../types';

interface ReminderFormProps {
  editingReminder?: Reminder | null;
  preselectedTaskId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * ReminderForm component - Form to create or edit reminders
 */
export function ReminderForm({
  editingReminder,
  preselectedTaskId,
  onSuccess,
  onCancel,
  className,
}: ReminderFormProps) {
  const { t } = useTranslation();
  const { tasks } = useTaskStore();
  const { addReminder, updateReminder } = useReminderStore();
  const { permission, requestPermission, isSupported } = useNotifications();

  // Form state
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    editingReminder?.taskId || preselectedTaskId || ''
  );
  const [reminderDate, setReminderDate] = useState<string>(
    editingReminder
      ? format(new Date(editingReminder.date), "yyyy-MM-dd'T'HH:mm")
      : format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")
  );
  const [reminderType, setReminderType] = useState<ReminderType>(
    editingReminder?.type || 'browser'
  );
  const [error, setError] = useState<string>('');

  const isEditing = !!editingReminder;

  // Update form when editingReminder changes
  useEffect(() => {
    if (editingReminder) {
      setSelectedTaskId(editingReminder.taskId);
      setReminderDate(format(new Date(editingReminder.date), "yyyy-MM-dd'T'HH:mm"));
      setReminderType(editingReminder.type);
    } else if (preselectedTaskId) {
      setSelectedTaskId(preselectedTaskId);
    }
  }, [editingReminder, preselectedTaskId]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedTaskId) {
      setError(t('reminders.errors.selectTask'));
      return;
    }

    if (!reminderDate) {
      setError(t('reminders.errors.selectDate'));
      return;
    }

    const reminderDateObj = new Date(reminderDate);

    if (reminderDateObj <= new Date()) {
      setError(t('reminders.errors.futureDate'));
      return;
    }

    // Check notification permission for browser notifications
    if (reminderType === 'browser' && permission !== 'granted') {
      requestPermission().then((result) => {
        if (result !== 'granted') {
          setError(t('reminders.errors.notificationPermission'));
        }
      });
      return;
    }

    // Create or update reminder
    if (isEditing && editingReminder) {
      updateReminder(editingReminder.id, {
        taskId: selectedTaskId,
        date: reminderDateObj,
        type: reminderType,
      });
    } else {
      addReminder({
        taskId: selectedTaskId,
        date: reminderDateObj,
        type: reminderType,
      });
    }

    // Reset form if not editing
    if (!isEditing) {
      setSelectedTaskId(preselectedTaskId || '');
      setReminderDate(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
      setReminderType('browser');
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Handle enabling notifications
   */
  const handleEnableNotifications = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      setError('');
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>
          {isEditing ? t('reminders.editReminder') : t('reminders.createReminder')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Notification Permission Warning */}
        {isSupported && permission !== 'granted' && reminderType === 'browser' && (
          <div className="mb-4 p-3 rounded-lg bg-muted border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              {t('notifications.enablePrompt')}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEnableNotifications}
            >
              {t('notifications.enable')}
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Selection */}
          <div className="space-y-2">
            <label
              htmlFor="task-select"
              className="block text-sm font-medium"
            >
              {t('reminders.selectTask')}
            </label>
            <select
              id="task-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{t('reminders.selectTaskPlaceholder')}</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date/Time Selection */}
          <div className="space-y-2">
            <label
              htmlFor="reminder-date"
              className="block text-sm font-medium"
            >
              {t('reminders.reminderDateTime')}
            </label>
            <input
              id="reminder-date"
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Reminder Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t('reminders.reminderType')}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reminder-type"
                  value="browser"
                  checked={reminderType === 'browser'}
                  onChange={(e) => setReminderType(e.target.value as ReminderType)}
                  className="h-4 w-4 text-primary focus:ring-primary border-input"
                />
                <span className="text-sm">{t('reminders.typeBrowser')}</span>
              </label>
              {/* Email type is defined in types but not fully implemented */}
              {/* <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reminder-type"
                  value="email"
                  checked={reminderType === 'email'}
                  onChange={(e) => setReminderType(e.target.value as ReminderType)}
                  className="h-4 w-4 text-primary focus:ring-primary border-input"
                />
                <span className="text-sm">{t('reminders.typeEmail')}</span>
              </label> */}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
            )}
            <Button type="submit">
              {isEditing ? t('common.save') : t('reminders.createReminder')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
