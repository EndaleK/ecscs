import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventStore } from '@/stores/event-store';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

/**
 * Gets the number of days in a month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets the day of the week for the first day of the month (0 = Sunday)
 */
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Formats a date as YYYY-MM-DD for comparison
 */
function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Mini Calendar Widget Component
 * Displays a compact month view with event indicators
 */
export function MiniCalendar({
  selectedDate,
  onDateSelect,
  className,
}: MiniCalendarProps) {
  const { t } = useTranslation();
  const { events } = useEventStore();

  const today = new Date();
  const [viewDate, setViewDate] = useState(selectedDate || today);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Day names (short)
  const dayNames = [
    t('calendar.mini.days.sun', 'Su'),
    t('calendar.mini.days.mon', 'Mo'),
    t('calendar.mini.days.tue', 'Tu'),
    t('calendar.mini.days.wed', 'We'),
    t('calendar.mini.days.thu', 'Th'),
    t('calendar.mini.days.fri', 'Fr'),
    t('calendar.mini.days.sat', 'Sa'),
  ];

  // Month names
  const monthNames = [
    t('calendar.months.january', 'January'),
    t('calendar.months.february', 'February'),
    t('calendar.months.march', 'March'),
    t('calendar.months.april', 'April'),
    t('calendar.months.may', 'May'),
    t('calendar.months.june', 'June'),
    t('calendar.months.july', 'July'),
    t('calendar.months.august', 'August'),
    t('calendar.months.september', 'September'),
    t('calendar.months.october', 'October'),
    t('calendar.months.november', 'November'),
    t('calendar.months.december', 'December'),
  ];

  // Create a set of dates that have events for quick lookup
  const datesWithEvents = useMemo(() => {
    const eventDates = new Set<string>();

    events.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Add all dates between start and end
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        eventDates.add(formatDateKey(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return eventDates;
  }, [events]);

  // Generate calendar grid
  const calendarGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const grid: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      grid.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }

    return grid;
  }, [currentMonth, currentYear]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setViewDate(new Date());
    onDateSelect?.(new Date());
  };

  // Handle date click
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    onDateSelect?.(clickedDate);
  };

  // Check if a date is today
  const isToday = (day: number): boolean => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  // Check if a date has events
  const hasEvents = (day: number): boolean => {
    const dateKey = formatDateKey(new Date(currentYear, currentMonth, day));
    return datesWithEvents.has(dateKey);
  };

  return (
    <Card className={cn('w-full max-w-xs', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToPreviousMonth}
              aria-label={t('calendar.mini.previousMonth', 'Previous month')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={goToToday}
            >
              {t('calendar.mini.today', 'Today')}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToNextMonth}
              aria-label={t('calendar.mini.nextMonth', 'Next month')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((day, index) => (
            <div key={index} className="aspect-square">
              {day !== null ? (
                <button
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    'w-full h-full flex flex-col items-center justify-center rounded-md text-sm relative transition-colors',
                    'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                    isToday(day) && !isSelected(day) && 'bg-primary/10 text-primary font-medium',
                    isSelected(day) && 'bg-primary text-primary-foreground font-medium',
                    !isToday(day) && !isSelected(day) && 'text-foreground'
                  )}
                >
                  <span>{day}</span>
                  {/* Event indicator dot */}
                  {hasEvents(day) && (
                    <span
                      className={cn(
                        'absolute bottom-1 w-1 h-1 rounded-full',
                        isSelected(day) ? 'bg-primary-foreground' : 'bg-primary'
                      )}
                    />
                  )}
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
