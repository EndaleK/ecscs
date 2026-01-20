import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ListTodo, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/features/tasks/task-list';
import { TaskForm } from '@/components/features/tasks/task-form';
import { TaskFilters } from '@/components/features/tasks/task-filters';
import { TaskDialog } from '@/components/features/tasks/task-dialog';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import { useContactStore } from '@/stores/contact-store';
import type { Task } from '@/types';
import type { TaskFilters as TaskFiltersType, TaskSortConfig } from '@/stores/task-store';

export function TasksPage() {
  const { t } = useTranslation();
  const { tasks, addTask, updateTask, deleteTask, toggleChecklistItem } = useTaskStore();
  const { categories } = useCategoryStore();
  const { contacts } = useContactStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<TaskFiltersType>({
    categoryId: null,
    status: null,
    priority: null,
    assigneeId: null,
    dateFrom: null,
    dateTo: null,
    searchQuery: '',
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState<TaskSortConfig>({
    field: 'dueDate',
    direction: 'asc',
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (newFilters: Partial<TaskFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: null,
      status: null,
      priority: null,
      assigneeId: null,
      dateFrom: null,
      dateTo: null,
      searchQuery: '',
    });
  };

  const handleAddTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(data);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const confirmDelete = window.confirm(t('tasks.confirmDelete'));
    if (confirmDelete) {
      deleteTask(taskId);
      setSelectedTask(null);
      setTaskDialogOpen(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        status: task.status === 'done' ? 'todo' : 'done',
      });
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleTaskDialogUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
    // Update selected task to reflect changes
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  // Apply filters and sorting
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.categoryId) {
      result = result.filter((task) => task.categoryId === filters.categoryId);
    }
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }
    if (filters.assigneeId) {
      result = result.filter((task) => task.assigneeIds.includes(filters.assigneeId!));
    }
    if (filters.dateFrom) {
      result = result.filter(
        (task) => new Date(task.dueDate) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      result = result.filter(
        (task) => new Date(task.dueDate) <= filters.dateTo!
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority': {
          const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case 'status': {
          const statusOrder = { todo: 0, in_progress: 1, done: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        }
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, searchQuery, filters, sortConfig]);

  // Get selected task's category and assignees
  const selectedTaskCategory = selectedTask
    ? categories.find((c) => c.id === selectedTask.categoryId)
    : undefined;
  const selectedTaskAssignees = selectedTask
    ? contacts.filter((c) => selectedTask.assigneeIds.includes(c.id))
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <ListTodo className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('sidebar.tasks')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('tasks.description')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="bg-secondary hover:bg-secondary-dark text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('tasks.addTask')}
        </Button>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <TaskFilters
          filters={filters}
          categories={categories}
          contacts={contacts}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto p-6">
        <TaskList
          tasks={filteredAndSortedTasks}
          categories={categories}
          contacts={contacts}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onToggleComplete={handleToggleComplete}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Add/Edit Task Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleFormCancel}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            {/* Ethiopian flag stripe at top */}
            <div className="h-1 w-full flex">
              <div className="flex-1 bg-secondary"></div>
              <div className="flex-1 bg-accent"></div>
              <div className="flex-1 bg-destructive"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted">
              <h2 className="text-lg font-semibold text-foreground">
                {editingTask ? t('tasks.editTask') : t('tasks.addTask')}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleFormCancel}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-5rem)]">
              <TaskForm
                initialData={editingTask || undefined}
                categories={categories}
                contacts={contacts}
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Dialog */}
      <TaskDialog
        task={selectedTask}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        category={selectedTaskCategory}
        assignees={selectedTaskAssignees}
        categories={categories}
        contacts={contacts}
        onUpdate={handleTaskDialogUpdate}
        onDelete={handleDeleteTask}
        onToggleChecklistItem={toggleChecklistItem}
      />
    </div>
  );
}
