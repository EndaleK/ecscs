import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { Temporal } from '@js-temporal/polyfill';
import '@schedule-x/theme-default/dist/index.css';

import { useEventStore } from '@/stores/event-store';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import { Button } from '@/components/ui/button';
import type { Event as CalendarEvent } from '@/types';

interface CalendarViewProps {
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
  showTasks?: boolean;
}

type ViewType = 'day' | 'week' | 'month-grid';

/**
 * Converts a JS Date to Temporal.PlainDate
 */
function dateToPlainDate(date: Date): Temporal.PlainDate {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

/**
 * Converts a JS Date to Temporal.ZonedDateTime (for timed events)
 */
function dateToZonedDateTime(date: Date): Temporal.ZonedDateTime {
  return Temporal.ZonedDateTime.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: 0,
    timeZone: Temporal.Now.timeZoneId(),
  });
}

interface ScheduleXEventInternal {
  id: string;
  title: string;
  start: Temporal.ZonedDateTime | Temporal.PlainDate;
  end: Temporal.ZonedDateTime | Temporal.PlainDate;
  calendarId: string;
  location?: string;
  description?: string;
  _originalEvent?: CalendarEvent;
  _originalTask?: unknown;
}

/**
 * Safely converts a JS Date to Temporal.PlainDate for Schedule-X
 */
function getTemporalPlainDate(date?: Date): Temporal.PlainDate {
  try {
    const d = date && !isNaN(date.getTime()) ? date : new Date();
    return Temporal.PlainDate.from({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    });
  } catch {
    // Fallback to today
    return Temporal.Now.plainDateISO();
  }
}

/**
 * Inner calendar component that re-renders when view changes
 */
function CalendarInner({
  view,
  scheduleXEvents,
  calendarsConfig,
  selectedDate,
  onEventClick,
  onDateClick,
}: {
  view: ViewType;
  scheduleXEvents: ScheduleXEventInternal[];
  calendarsConfig: Record<string, { colorName: string; lightColors: { main: string; container: string; onContainer: string } }>;
  selectedDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}) {
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const temporalSelectedDate = useMemo(() => getTemporalPlainDate(selectedDate), [selectedDate]);

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    defaultView: view,
    events: scheduleXEvents,
    calendars: calendarsConfig,
    selectedDate: temporalSelectedDate,
    plugins: [eventsService],
    callbacks: {
      onEventClick(calendarEvent) {
        if (onEventClick && calendarEvent._originalEvent) {
          onEventClick(calendarEvent._originalEvent as CalendarEvent);
        }
      },
      onClickDate(date) {
        if (onDateClick) {
          onDateClick(new Date(date));
        }
      },
      onClickDateTime(dateTime) {
        if (onDateClick) {
          onDateClick(new Date(dateTime));
        }
      },
    },
  });

  // Update events when they change - only after initial mount
  useEffect(() => {
    // Small delay to ensure calendar is fully initialized
    const timeoutId = setTimeout(() => {
      if (eventsService) {
        eventsService.set(scheduleXEvents);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [scheduleXEvents, eventsService]);

  if (!calendar) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading calendar...</div>;
  }

  return <ScheduleXCalendar calendarApp={calendar} />;
}

/**
 * Main Calendar View Component
 * Uses Schedule-X for calendar rendering with Day, Week, and Month view toggles
 */
export function CalendarView({
  onEventClick,
  onDateClick,
  selectedDate,
  showTasks = true,
}: CalendarViewProps) {
  const { t } = useTranslation();
  const { events } = useEventStore();
  const { tasks } = useTaskStore();
  const { categories } = useCategoryStore();

  const [currentView, setCurrentView] = useState<ViewType>('week');

  // Create category color mapping
  const categoryColors = useMemo(() => {
    const colorMap: Record<string, { main: string; container: string; onContainer: string }> = {};
    categories.forEach((category) => {
      colorMap[category.id] = {
        main: category.color,
        container: `${category.color}20`,
        onContainer: category.color,
      };
    });
    return colorMap;
  }, [categories]);

  // Create calendars config from categories
  const calendarsConfig = useMemo(() => {
    const config: Record<string, {
      colorName: string;
      lightColors: { main: string; container: string; onContainer: string };
    }> = {
      default: {
        colorName: 'default',
        lightColors: {
          main: '#2E7D32', // Vibrant green
          container: '#2E7D3220',
          onContainer: '#2E7D32',
        },
      },
      task: {
        colorName: 'task',
        lightColors: {
          main: '#C5A059', // Anniversary gold
          container: '#C5A05930',
          onContainer: '#8B7335',
        },
      },
    };

    categories.forEach((category) => {
      config[category.id] = {
        colorName: category.id,
        lightColors: categoryColors[category.id] || config.default.lightColors,
      };
    });

    return config;
  }, [categories, categoryColors]);

  // Convert store events to Schedule-X format with Temporal API
  const scheduleXEvents = useMemo(() => {
    const calendarEvents: ScheduleXEventInternal[] = [];

    // Safely process events
    events.forEach((event) => {
      try {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        // Skip if dates are invalid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return;
        }

        calendarEvents.push({
          id: event.id,
          title: event.title,
          start: dateToZonedDateTime(startDate),
          end: dateToZonedDateTime(endDate),
          calendarId: event.categoryId || 'default',
          location: event.location || undefined,
          description: event.description || undefined,
          _originalEvent: event,
        });
      } catch {
        // Skip invalid events
      }
    });

    // Add tasks with due dates as calendar events if showTasks is enabled
    const taskEvents: ScheduleXEventInternal[] = [];
    if (showTasks) {
      tasks.forEach((task) => {
        try {
          if (!task.dueDate) return;

          const dueDate = new Date(task.dueDate);

          // Skip if date is invalid
          if (isNaN(dueDate.getTime())) {
            return;
          }

          // Tasks are all-day events (no specific time)
          const plainDate = dateToPlainDate(dueDate);
          taskEvents.push({
            id: `task-${task.id}`,
            title: `[Task] ${task.title}`,
            start: plainDate,
            end: plainDate,
            calendarId: 'task',
            description: task.description || undefined,
            _originalTask: task,
          });
        } catch {
          // Skip invalid tasks
        }
      });
    }

    return [...calendarEvents, ...taskEvents];
  }, [events, tasks, showTasks]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col h-full">
      {/* View Toggle Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={currentView === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('day')}
          className={currentView === 'day' ? 'bg-primary hover:bg-primary-dark' : ''}
        >
          {t('calendar.views.day', 'Day')}
        </Button>
        <Button
          variant={currentView === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('week')}
          className={currentView === 'week' ? 'bg-primary hover:bg-primary-dark' : ''}
        >
          {t('calendar.views.week', 'Week')}
        </Button>
        <Button
          variant={currentView === 'month-grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('month-grid')}
          className={currentView === 'month-grid' ? 'bg-primary hover:bg-primary-dark' : ''}
        >
          {t('calendar.views.month', 'Month')}
        </Button>
      </div>

      {/* Calendar Container */}
      <div className="flex-1 min-h-[500px] sx-react-calendar-wrapper">
        <CalendarInner
          key={currentView}
          view={currentView}
          scheduleXEvents={scheduleXEvents}
          calendarsConfig={calendarsConfig}
          selectedDate={selectedDate}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
        />
      </div>
    </div>
  );
}
