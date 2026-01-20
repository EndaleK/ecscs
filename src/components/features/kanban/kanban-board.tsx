import { useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { Task, TaskStatus } from '@/types';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

interface Column {
  id: TaskStatus;
  title: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export function KanbanBoard({ tasks, onTaskMove, onTaskClick }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === 'todo'),
      in_progress: tasks.filter((task) => task.status === 'in_progress'),
      done: tasks.filter((task) => task.status === 'done'),
    };
  }, [tasks]);

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const task = tasks.find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
      }
    },
    [tasks]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);

      if (!task) return;

      // Determine the target status
      let targetStatus: TaskStatus | null = null;

      // Check if dropped over a column
      if (over.data.current?.type === 'column') {
        targetStatus = over.data.current.status as TaskStatus;
      }
      // Check if dropped over another task (use that task's status)
      else if (over.data.current?.type === 'task') {
        const overTask = over.data.current.task as Task;
        targetStatus = overTask.status;
      }
      // Check if dropped directly on a column (over.id is the column status)
      else if (columns.some((col) => col.id === over.id)) {
        targetStatus = over.id as TaskStatus;
      }

      // Only move if status changed
      if (targetStatus && targetStatus !== task.status) {
        onTaskMove(taskId, targetStatus);
      }
    },
    [tasks, onTaskMove]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[500px]">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      {/* Drag Overlay - shows the dragged item */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-3 scale-105">
            <KanbanCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
