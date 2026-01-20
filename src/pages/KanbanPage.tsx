import { useState, useMemo, useCallback } from 'react';
import { KanbanBoard } from '@/components/features/kanban/kanban-board';
import { KanbanFilters } from '@/components/features/kanban/kanban-filters';
import { useTaskStore } from '@/stores/task-store';
import type { Task, TaskStatus } from '@/types';

export function KanbanPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const moveTask = useTaskStore((state) => state.moveTask);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);

  // Selected task for details modal (if needed)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Category filter
      if (selectedCategoryId && task.categoryId !== selectedCategoryId) {
        return false;
      }

      // Assignee filter
      if (selectedAssigneeId) {
        if (selectedAssigneeId === 'unassigned') {
          if (task.assigneeIds.length > 0) {
            return false;
          }
        } else if (!task.assigneeIds.includes(selectedAssigneeId)) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, selectedCategoryId, selectedAssigneeId]);

  // Handle task status change on drop
  const handleTaskMove = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      moveTask(taskId, newStatus);
    },
    [moveTask]
  );

  // Handle task click
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    // TODO: Open task details modal/drawer
    console.log('Task clicked:', task);
  }, []);

  return (
    <div className="flex flex-col h-full p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <KanbanFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          selectedAssigneeId={selectedAssigneeId}
          onAssigneeChange={setSelectedAssigneeId}
        />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          tasks={filteredTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Task Details Modal/Drawer would go here */}
      {selectedTask && (
        <div className="sr-only">
          {/* Placeholder for task details modal */}
          Selected Task: {selectedTask.title}
        </div>
      )}
    </div>
  );
}
