import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import { formatDate } from '@/lib/utils';
import type { Event as CalendarEvent } from '@/types';

interface EventCardProps {
  event: CalendarEvent;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  onClose?: () => void;
  onNavigateToTask?: (taskId: string) => void;
}

/**
 * Event Card Component
 * Displays event details in a card/popup format with edit and delete actions
 */
export function EventCard({
  event,
  onEdit,
  onDelete,
  onClose,
  onNavigateToTask,
}: EventCardProps) {
  const { t } = useTranslation();
  const { tasks } = useTaskStore();
  const { categories } = useCategoryStore();

  // Find linked task if any
  const linkedTask = event.taskId
    ? tasks.find((task) => task.id === event.taskId)
    : null;

  // Find category if any
  const category = event.categoryId
    ? categories.find((cat) => cat.id === event.categoryId)
    : null;

  // Format dates for display
  const formattedStartDate = formatDate(event.startDate, 'PPP p');
  const formattedEndDate = formatDate(event.endDate, 'PPP p');

  // Check if event spans multiple days
  const startDateOnly = formatDate(event.startDate, 'yyyy-MM-dd');
  const endDateOnly = formatDate(event.endDate, 'yyyy-MM-dd');
  const isMultiDay = startDateOnly !== endDateOnly;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            {category && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {category.name}
                </span>
              </div>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 -mt-1 -mr-2"
              aria-label={t('common.close', 'Close')}
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Date and Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
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
              className="text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <div>
              {isMultiDay ? (
                <>
                  <div className="text-foreground">{formattedStartDate}</div>
                  <div className="text-foreground">{t('calendar.eventCard.to', 'to')} {formattedEndDate}</div>
                </>
              ) : (
                <>
                  <div className="text-foreground">{formatDate(event.startDate, 'PPP')}</div>
                  <div className="text-muted-foreground">
                    {formatDate(event.startDate, 'p')} - {formatDate(event.endDate, 'p')}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2 text-sm">
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
              className="text-muted-foreground mt-0.5"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-foreground">{event.location}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="text-sm">
            <div className="font-medium text-foreground mb-1">
              {t('calendar.eventCard.description', 'Description')}
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        {/* Linked Task */}
        {linkedTask && (
          <div className="flex items-start gap-2 text-sm">
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
              className="text-muted-foreground mt-0.5"
            >
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
            </svg>
            <div className="flex-1">
              <span className="text-muted-foreground">
                {t('calendar.eventCard.linkedTask', 'Linked Task')}:
              </span>
              <button
                onClick={() => onNavigateToTask?.(linkedTask.id)}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {linkedTask.title}
              </button>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    linkedTask.status === 'done'
                      ? 'bg-green-100 text-green-800'
                      : linkedTask.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {linkedTask.status === 'done'
                    ? t('tasks.status.done', 'Done')
                    : linkedTask.status === 'in_progress'
                    ? t('tasks.status.inProgress', 'In Progress')
                    : t('tasks.status.todo', 'To Do')}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-2">
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(event.id)}
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
              className="mr-1"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            {t('common.delete', 'Delete')}
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(event)}
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
              className="mr-1"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            {t('common.edit', 'Edit')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
