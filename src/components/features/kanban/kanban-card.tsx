import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, AlertCircle, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Task, TaskPriority } from '@/types';
import { useCategoryStore } from '@/stores/category-store';

interface KanbanCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-600',
  },
  medium: {
    label: 'Medium',
    className: 'bg-blue-100 text-blue-600',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-600',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-600',
  },
};

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const categories = useCategoryStore((state) => state.categories);
  const category = categories.find((c) => c.id === task.categoryId);

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const priorityInfo = priorityConfig[task.priority];

  const handleClick = () => {
    if (onClick && !isDragging) {
      onClick(task);
    }
  };

  const completedChecklist = task.checklist.filter((item) => item.completed).length;
  const totalChecklist = task.checklist.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-card p-3 shadow-sm transition-all',
        'hover:shadow-md hover:border-primary/30',
        isDragging && 'opacity-50 shadow-lg rotate-2 scale-105',
        'cursor-pointer'
      )}
      onClick={handleClick}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'cursor-grab active:cursor-grabbing',
          'hover:bg-muted'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="pl-5">
        {/* Category Color Indicator */}
        {category && (
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs text-muted-foreground truncate">
              {category.name}
            </span>
          </div>
        )}

        {/* Task Title */}
        <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-2">
          {task.title}
        </h4>

        {/* Task Meta */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              priorityInfo.className
            )}
          >
            {task.priority === 'urgent' && (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {priorityInfo.label}
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs',
                isOverdue ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate, 'MMM d')}
            </span>
          )}

          {/* Checklist Progress */}
          {totalChecklist > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {completedChecklist}/{totalChecklist}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
