import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, AlertTriangle, XCircle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/task-store';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { useCategoryStore } from '@/stores/category-store';
import { cn } from '@/lib/utils';
import { formatDate, formatDateRelative } from '@/lib/utils';

interface MyShiftsProps {
  volunteerEmail: string;
  onCancelShift?: (taskId: string) => void;
  className?: string;
}

export function MyShifts({ volunteerEmail, onCancelShift, className }: MyShiftsProps) {
  const { t } = useTranslation();
  const { tasks } = useTaskStore();
  const { volunteers, unassignShift } = useVolunteerStore();
  const { categories } = useCategoryStore();

  // Find current volunteer by email
  const currentVolunteer = useMemo(() => {
    return volunteers.find((v) => v.email.toLowerCase() === volunteerEmail.toLowerCase());
  }, [volunteers, volunteerEmail]);

  // Get tasks assigned to current volunteer
  const assignedShifts = useMemo(() => {
    if (!currentVolunteer) return [];

    return currentVolunteer.assignedShifts
      .map((taskId) => tasks.find((t) => t.id === taskId))
      .filter((task): task is NonNullable<typeof task> => task !== undefined)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [currentVolunteer, tasks]);

  // Separate upcoming and past shifts
  const { upcomingShifts, pastShifts } = useMemo(() => {
    const now = new Date();
    const upcoming: typeof assignedShifts = [];
    const past: typeof assignedShifts = [];

    assignedShifts.forEach((shift) => {
      if (new Date(shift.dueDate) >= now) {
        upcoming.push(shift);
      } else {
        past.push(shift);
      }
    });

    return { upcomingShifts: upcoming, pastShifts: past };
  }, [assignedShifts]);

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const handleCancelShift = (taskId: string) => {
    if (!currentVolunteer) return;

    const confirmCancel = window.confirm(t('volunteers.confirmCancelShift'));
    if (!confirmCancel) return;

    unassignShift(currentVolunteer.id, taskId);
    onCancelShift?.(taskId);
  };

  const isShiftSoon = (dueDate: Date) => {
    const now = new Date();
    const shiftDate = new Date(dueDate);
    const hoursUntil = (shiftDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil <= 24 && hoursUntil > 0;
  };

  if (!currentVolunteer) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-gray-500', className)}>
        <AlertTriangle className="w-12 h-12 mb-4 text-yellow-500" />
        <p className="text-lg font-medium">{t('volunteers.notFound')}</p>
        <p className="text-sm text-center max-w-md">
          {t('volunteers.notFoundDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('volunteers.myShifts')}
        </h2>
        <p className="text-sm text-gray-500">
          {t('volunteers.myShiftsDescription', { count: assignedShifts.length })}
        </p>
      </div>

      {/* Shifts Content */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {assignedShifts.length > 0 ? (
          <>
            {/* Upcoming Shifts */}
            {upcomingShifts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  {t('volunteers.upcomingShifts')} ({upcomingShifts.length})
                </h3>
                <div className="space-y-3">
                  {upcomingShifts.map((task) => {
                    const category = getCategory(task.categoryId);
                    const isSoon = isShiftSoon(task.dueDate);

                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'bg-white border rounded-lg p-4',
                          isSoon ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                        )}
                      >
                        {isSoon && (
                          <div className="flex items-center gap-1 text-orange-600 text-xs font-medium mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            {t('volunteers.shiftSoon')}
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{task.title}</h4>

                            {category && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              >
                                {category.name}
                              </span>
                            )}

                            {task.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(task.dueDate, 'EEEE, MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(task.dueDate, 'h:mm a')}</span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                              {formatDateRelative(task.dueDate)}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelShift(task.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {t('volunteers.cancelSignup')}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Shifts */}
            {pastShifts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('volunteers.pastShifts')} ({pastShifts.length})
                </h3>
                <div className="space-y-3">
                  {pastShifts.map((task) => {
                    const category = getCategory(task.categoryId);

                    return (
                      <div
                        key={task.id}
                        className="bg-gray-50 border border-gray-100 rounded-lg p-4 opacity-75"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-700">{task.title}</h4>

                          {category && (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 opacity-70"
                              style={{
                                backgroundColor: `${category.color}20`,
                                color: category.color,
                              }}
                            >
                              {category.name}
                            </span>
                          )}

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(task.dueDate, 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(task.dueDate, 'h:mm a')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <ClipboardList className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">{t('volunteers.noShiftsAssigned')}</p>
            <p className="text-sm text-center max-w-md">
              {t('volunteers.noShiftsAssignedDescription')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
