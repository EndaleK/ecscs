import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateRelative } from '@/lib/utils';
import { useMemo } from 'react';
import { CheckCircle, Clock, AlertCircle, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import type { TaskPriority } from '@/types';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation();

  const config: Record<TaskPriority, { color: string; bgColor: string; icon: React.ReactNode }> = {
    low: {
      color: '#6B7280',
      bgColor: '#6B728020',
      icon: <ArrowUpCircle className="h-3 w-3 rotate-180" />,
    },
    medium: {
      color: '#3B82F6',
      bgColor: '#3B82F620',
      icon: <Clock className="h-3 w-3" />,
    },
    high: {
      color: '#F59E0B',
      bgColor: '#F59E0B20',
      icon: <AlertCircle className="h-3 w-3" />,
    },
    urgent: {
      color: '#EF4444',
      bgColor: '#EF444420',
      icon: <AlertTriangle className="h-3 w-3" />,
    },
  };

  const { color, bgColor, icon } = config[priority];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color, backgroundColor: bgColor }}
    >
      {icon}
      {t(`priorities.${priority}`)}
    </span>
  );
}

interface TaskItemProps {
  id: string;
  title: string;
  dueDate: Date;
  priority: TaskPriority;
  categoryColor?: string;
  onMarkComplete: (id: string) => void;
}

function TaskItem({
  id,
  title,
  dueDate,
  priority,
  categoryColor,
  onMarkComplete,
}: TaskItemProps) {
  const { t } = useTranslation();
  const isOverdue = new Date(dueDate) < new Date();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Category indicator */}
      <div
        className="w-1 h-10 rounded-full shrink-0"
        style={{ backgroundColor: categoryColor || '#6B7280' }}
      />

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p
          className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {isOverdue && (
            <AlertTriangle className="inline h-3 w-3 mr-1" />
          )}
          {formatDateRelative(dueDate)}
        </p>
      </div>

      {/* Priority badge */}
      <PriorityBadge priority={priority} />

      {/* Complete button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onMarkComplete(id)}
        title={t('dashboard.markComplete')}
      >
        <CheckCircle className="h-4 w-4 text-muted-foreground hover:text-green-500" />
      </Button>
    </div>
  );
}

export function UpcomingTasks() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const moveTask = useTaskStore((state) => state.moveTask);
  const categories = useCategoryStore((state) => state.categories);

  const upcomingTasks = useMemo(() => {
    // Get tasks that are not done, sorted by due date
    return tasks
      .filter((task) => task.status !== 'done')
      .sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5)
      .map((task) => {
        const category = categories.find((c) => c.id === task.categoryId);
        return {
          ...task,
          categoryColor: category?.color,
        };
      });
  }, [tasks, categories]);

  const handleMarkComplete = (taskId: string) => {
    moveTask(taskId, 'done');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('dashboard.upcomingTasks')}</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noUpcomingTasks')}
            </p>
          </div>
        ) : (
          <div>
            {upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                dueDate={task.dueDate}
                priority={task.priority}
                categoryColor={task.categoryColor}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
