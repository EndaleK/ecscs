import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import type { Event as CalendarEvent } from '@/types';

interface EventFormProps {
  event?: CalendarEvent | null;
  initialDate?: Date;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
}

/**
 * Formats a Date object to a datetime-local input compatible string
 */
function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parses a datetime-local input string to a Date object
 */
function parseDateFromInput(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Event Form Component
 * Allows creating and editing calendar events with title, description, dates, location,
 * task linking, and category selection
 */
export function EventForm({ event, initialDate, onSave, onCancel }: EventFormProps) {
  const { t } = useTranslation();
  const { tasks } = useTaskStore();
  const { categories } = useCategoryStore();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [taskId, setTaskId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with event data or defaults
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(formatDateForInput(new Date(event.startDate)));
      setEndDate(formatDateForInput(new Date(event.endDate)));
      setLocation(event.location || '');
      setTaskId(event.taskId || '');
      setCategoryId(event.categoryId || '');
    } else if (initialDate) {
      const start = new Date(initialDate);
      const end = new Date(initialDate);
      end.setHours(end.getHours() + 1);
      setStartDate(formatDateForInput(start));
      setEndDate(formatDateForInput(end));
    } else {
      const now = new Date();
      const later = new Date(now);
      later.setHours(later.getHours() + 1);
      setStartDate(formatDateForInput(now));
      setEndDate(formatDateForInput(later));
    }
  }, [event, initialDate]);

  // Update end date when start date changes (if end is before start)
  useEffect(() => {
    if (startDate && endDate) {
      const start = parseDateFromInput(startDate);
      const end = parseDateFromInput(endDate);
      if (end <= start) {
        const newEnd = new Date(start);
        newEnd.setHours(newEnd.getHours() + 1);
        setEndDate(formatDateForInput(newEnd));
      }
    }
  }, [startDate, endDate]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = t('calendar.form.errors.titleRequired', 'Title is required');
    }

    if (!startDate) {
      newErrors.startDate = t('calendar.form.errors.startDateRequired', 'Start date is required');
    }

    if (!endDate) {
      newErrors.endDate = t('calendar.form.errors.endDateRequired', 'End date is required');
    }

    if (startDate && endDate) {
      const start = parseDateFromInput(startDate);
      const end = parseDateFromInput(endDate);
      if (end <= start) {
        newErrors.endDate = t('calendar.form.errors.endDateAfterStart', 'End date must be after start date');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const eventData: Omit<CalendarEvent, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      startDate: parseDateFromInput(startDate),
      endDate: parseDateFromInput(endDate),
      location: location.trim(),
      taskId: taskId || undefined,
      categoryId: categoryId || undefined,
    };

    onSave(eventData);
  };

  return (
    <Card className="w-full max-w-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {event
              ? t('calendar.form.editTitle', 'Edit Event')
              : t('calendar.form.createTitle', 'Create Event')}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="event-title" className="text-sm font-medium text-foreground">
              {t('calendar.form.title', 'Title')} *
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('calendar.form.titlePlaceholder', 'Enter event title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="event-description" className="text-sm font-medium text-foreground">
              {t('calendar.form.description', 'Description')}
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={t('calendar.form.descriptionPlaceholder', 'Enter event description')}
            />
          </div>

          {/* Start Date/Time */}
          <div className="space-y-2">
            <label htmlFor="event-start" className="text-sm font-medium text-foreground">
              {t('calendar.form.startDateTime', 'Start Date/Time')} *
            </label>
            <input
              id="event-start"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate}</p>
            )}
          </div>

          {/* End Date/Time */}
          <div className="space-y-2">
            <label htmlFor="event-end" className="text-sm font-medium text-foreground">
              {t('calendar.form.endDateTime', 'End Date/Time')} *
            </label>
            <input
              id="event-end"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="event-location" className="text-sm font-medium text-foreground">
              {t('calendar.form.location', 'Location')}
            </label>
            <input
              id="event-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('calendar.form.locationPlaceholder', 'Enter event location')}
            />
          </div>

          {/* Link to Task (Optional) */}
          <div className="space-y-2">
            <label htmlFor="event-task" className="text-sm font-medium text-foreground">
              {t('calendar.form.linkedTask', 'Link to Task')} ({t('common.optional', 'Optional')})
            </label>
            <select
              id="event-task"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{t('calendar.form.noTaskLinked', 'No task linked')}</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category (Optional) */}
          <div className="space-y-2">
            <label htmlFor="event-category" className="text-sm font-medium text-foreground">
              {t('calendar.form.category', 'Category')} ({t('common.optional', 'Optional')})
            </label>
            <select
              id="event-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{t('calendar.form.noCategory', 'No category')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button type="submit">
            {t('common.save', 'Save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
