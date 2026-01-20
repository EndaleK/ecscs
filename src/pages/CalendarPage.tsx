import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarView } from '@/components/features/calendar/calendar-view';
import { EventForm } from '@/components/features/calendar/event-form';
import { EventCard } from '@/components/features/calendar/event-card';
import { MiniCalendar } from '@/components/features/calendar/mini-calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventStore } from '@/stores/event-store';
import type { Event as CalendarEvent } from '@/types';

type DialogMode = 'none' | 'create' | 'edit' | 'view';

/**
 * Calendar Page Component
 * Full calendar view with event management functionality
 */
export function CalendarPage() {
  const { t } = useTranslation();
  const { addEvent, updateEvent, deleteEvent, getEventsByDate } = useEventStore();

  // Dialog state
  const [dialogMode, setDialogMode] = useState<DialogMode>('none');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [initialFormDate, setInitialFormDate] = useState<Date | undefined>(undefined);

  // Open create event dialog
  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setInitialFormDate(selectedDate);
    setDialogMode('create');
  }, [selectedDate]);

  // Handle event click from calendar
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogMode('view');
  }, []);

  // Handle date click from calendar or mini-calendar
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Handle mini-calendar date selection
  const handleMiniCalendarDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Handle edit from event card
  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogMode('edit');
  }, []);

  // Handle delete from event card
  const handleDeleteEvent = useCallback((eventId: string) => {
    if (window.confirm(t('calendar.confirmDelete', 'Are you sure you want to delete this event?'))) {
      deleteEvent(eventId);
      setDialogMode('none');
      setSelectedEvent(null);
    }
  }, [deleteEvent, t]);

  // Handle save from event form
  const handleSaveEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    if (dialogMode === 'edit' && selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setDialogMode('none');
    setSelectedEvent(null);
    setInitialFormDate(undefined);
  }, [dialogMode, selectedEvent, addEvent, updateEvent]);

  // Handle cancel/close dialog
  const handleCloseDialog = useCallback(() => {
    setDialogMode('none');
    setSelectedEvent(null);
    setInitialFormDate(undefined);
  }, []);

  // Handle navigate to task from event card
  const handleNavigateToTask = useCallback((taskId: string) => {
    // TODO: Implement navigation to task page
    console.log('Navigate to task:', taskId);
  }, []);

  // Get events for the selected date
  const eventsForSelectedDate = getEventsByDate(selectedDate);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('calendar.pageTitle', 'Calendar')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('calendar.pageSubtitle', 'Manage your events and schedule')}
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddEvent}
          className="bg-secondary hover:bg-secondary-dark text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('calendar.addEvent', 'Add Event')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Sidebar with Mini Calendar and Selected Date Events */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
          {/* Mini Calendar */}
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={handleMiniCalendarDateSelect}
          />

          {/* Events for Selected Date */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {t('calendar.eventsOn', 'Events on')}{' '}
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('calendar.noEventsForDate', 'No events for this date')}
                </p>
              ) : (
                <ul className="space-y-2">
                  {eventsForSelectedDate.map((event) => (
                    <li key={event.id}>
                      <button
                        onClick={() => handleEventClick(event)}
                        className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-sm text-foreground truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.startDate).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(event.endDate).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar View */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <Card className="h-full">
            <CardContent className="h-full p-4">
              <CalendarView
                selectedDate={selectedDate}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                showTasks={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Overlay */}
      {dialogMode !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseDialog}
          />

          {/* Dialog Content */}
          <div className="relative z-10 max-w-2xl w-full mx-4">
            {(dialogMode === 'create' || dialogMode === 'edit') && (
              <EventForm
                event={dialogMode === 'edit' ? selectedEvent : null}
                initialDate={initialFormDate}
                onSave={handleSaveEvent}
                onCancel={handleCloseDialog}
              />
            )}

            {dialogMode === 'view' && selectedEvent && (
              <EventCard
                event={selectedEvent}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onClose={handleCloseDialog}
                onNavigateToTask={handleNavigateToTask}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
