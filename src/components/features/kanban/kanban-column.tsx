import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import type { Task, TaskStatus } from '@/types';
import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const columnColors: Record<TaskStatus, string> = {
  todo: 'border-t-slate-400',
  in_progress: 'border-t-blue-500',
  done: 'border-t-green-500',
};

const columnBgColors: Record<TaskStatus, string> = {
  todo: 'bg-slate-50',
  in_progress: 'bg-blue-50',
  done: 'bg-green-50',
};

export function KanbanColumn({ id, title, tasks, onTaskClick }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: 'column',
      status: id,
    },
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      className={cn(
        'flex flex-col min-w-[300px] max-w-[350px] w-full',
        'rounded-lg border border-t-4 bg-card',
        columnColors[id]
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border-b',
          columnBgColors[id]
        )}
      >
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span
          className={cn(
            'inline-flex items-center justify-center',
            'min-w-[24px] h-6 px-2 rounded-full',
            'text-xs font-medium',
            'bg-background text-muted-foreground'
          )}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 min-h-[200px] transition-colors',
          'overflow-y-auto',
          isOver && 'bg-primary/5'
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
              ))}
            </div>
          ) : (
            <div
              className={cn(
                'flex items-center justify-center h-full min-h-[150px]',
                'text-sm text-muted-foreground'
              )}
            >
              <div className="text-center">
                <p>No tasks</p>
                <p className="text-xs mt-1">Drag tasks here</p>
              </div>
            </div>
          )}
        </SortableContext>

        {/* Drop Indicator */}
        {isOver && (
          <div
            className={cn(
              'mt-3 h-16 rounded-lg border-2 border-dashed',
              'border-primary/50 bg-primary/10',
              'flex items-center justify-center',
              'text-sm text-primary/70'
            )}
          >
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
