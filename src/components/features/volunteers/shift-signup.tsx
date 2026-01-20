import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Users, Filter, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/task-store';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { useCategoryStore } from '@/stores/category-store';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { Task } from '@/types';

interface ShiftSignupProps {
  volunteerEmail?: string;
  onSignup?: (taskId: string) => void;
  className?: string;
}

export function ShiftSignup({ volunteerEmail, onSignup, className }: ShiftSignupProps) {
  const { t } = useTranslation();
  const { tasks } = useTaskStore();
  const { volunteers, assignShift } = useVolunteerStore();
  const { categories } = useCategoryStore();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [signedUpTasks, setSignedUpTasks] = useState<Set<string>>(new Set());

  // Find current volunteer by email
  const currentVolunteer = useMemo(() => {
    if (!volunteerEmail) return null;
    return volunteers.find((v) => v.email.toLowerCase() === volunteerEmail.toLowerCase());
  }, [volunteers, volunteerEmail]);

  // Get tasks that need volunteers (tasks with status 'todo' or 'in_progress')
  const availableShifts = useMemo(() => {
    return tasks.filter((task) => {
      // Only show tasks that are not done
      if (task.status === 'done') return false;

      // Filter by date if selected
      if (selectedDate) {
        const taskDate = formatDate(task.dueDate, 'yyyy-MM-dd');
        if (taskDate !== selectedDate) return false;
      }

      // Filter by category if selected
      if (selectedCategory && task.categoryId !== selectedCategory) return false;

      return true;
    });
  }, [tasks, selectedDate, selectedCategory]);

  // Get unique dates from available shifts
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    tasks
      .filter((task) => task.status !== 'done')
      .forEach((task) => {
        dates.add(formatDate(task.dueDate, 'yyyy-MM-dd'));
      });
    return Array.from(dates).sort();
  }, [tasks]);

  const handleSignup = (task: Task) => {
    if (!currentVolunteer) return;

    // Check if already signed up
    if (currentVolunteer.assignedShifts.includes(task.id)) return;

    assignShift(currentVolunteer.id, task.id);
    setSignedUpTasks((prev) => new Set(prev).add(task.id));
    onSignup?.(task.id);
  };

  const isSignedUp = (taskId: string) => {
    if (!currentVolunteer) return false;
    return currentVolunteer.assignedShifts.includes(taskId) || signedUpTasks.has(taskId);
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getVolunteersForTask = (taskId: string) => {
    return volunteers.filter((v) => v.assignedShifts.includes(taskId));
  };

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedCategory('');
  };

  const hasActiveFilters = selectedDate || selectedCategory;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {t('volunteers.availableShifts')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('volunteers.availableShiftsDescription', { count: availableShifts.length })}
          </p>
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(hasActiveFilters && !showFilters && 'border-primary text-primary')}
        >
          <Filter className="w-4 h-4 mr-1" />
          {t('volunteers.filter')}
        </Button>
      </div>

      {/* Not Registered Warning */}
      {volunteerEmail && !currentVolunteer && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            {t('volunteers.notRegisteredWarning')}
          </p>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('volunteers.filterByDate')}
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">{t('volunteers.allDates')}</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date, 'EEEE, MMMM d, yyyy')}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('volunteers.filterByCategory')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">{t('volunteers.allCategories')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              {t('volunteers.clearFilters')}
            </Button>
          )}
        </div>
      )}

      {/* Shifts List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {availableShifts.length > 0 ? (
          availableShifts.map((task) => {
            const category = getCategory(task.categoryId);
            const assignedVolunteers = getVolunteersForTask(task.id);
            const isAlreadySignedUp = isSignedUp(task.id);

            return (
              <div
                key={task.id}
                className={cn(
                  'bg-white border rounded-lg p-4 transition-colors',
                  isAlreadySignedUp ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Task Title */}
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>

                    {/* Category Badge */}
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

                    {/* Task Description */}
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Task Details */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(task.dueDate, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(task.dueDate, 'h:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {assignedVolunteers.length} {t('volunteers.volunteersSignedUp')}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Volunteers */}
                    {assignedVolunteers.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex -space-x-2">
                          {assignedVolunteers.slice(0, 3).map((volunteer) => {
                            const initials = volunteer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2);
                            const avatarColor = `hsl(${volunteer.name.length * 37 % 360}, 70%, 50%)`;
                            return (
                              <div
                                key={volunteer.id}
                                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium text-white"
                                style={{ backgroundColor: avatarColor }}
                                title={volunteer.name}
                              >
                                {initials}
                              </div>
                            );
                          })}
                        </div>
                        {assignedVolunteers.length > 3 && (
                          <span className="text-xs text-gray-500 ml-1">
                            +{assignedVolunteers.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sign Up Button */}
                  <div className="shrink-0">
                    {isAlreadySignedUp ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{t('volunteers.signedUp')}</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSignup(task)}
                        disabled={!currentVolunteer}
                        size="sm"
                      >
                        {t('volunteers.signUp')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">{t('volunteers.noShiftsAvailable')}</p>
            <p className="text-sm">
              {hasActiveFilters
                ? t('volunteers.noMatchingShifts')
                : t('volunteers.checkBackLater')}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                {t('volunteers.clearFilters')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
