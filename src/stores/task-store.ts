import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, TaskPriority } from '../types';

export interface TaskFilters {
  categoryId: string | null;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  assigneeId: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  searchQuery: string;
}

export interface TaskSortConfig {
  field: 'dueDate' | 'priority' | 'status' | 'title' | 'createdAt';
  direction: 'asc' | 'desc';
}

const initialFilters: TaskFilters = {
  categoryId: null,
  status: null,
  priority: null,
  assigneeId: null,
  dateFrom: null,
  dateTo: null,
  searchQuery: '',
};

const initialSortConfig: TaskSortConfig = {
  field: 'dueDate',
  direction: 'asc',
};

const priorityOrder: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const statusOrder: Record<TaskStatus, number> = {
  todo: 0,
  in_progress: 1,
  done: 2,
};

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sortConfig: TaskSortConfig;
  viewMode: 'list' | 'grid';

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  toggleTaskStatus: (id: string) => void;
  toggleChecklistItem: (taskId: string, checklistItemId: string) => void;

  // Filter actions
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;

  // Sort actions
  setSortConfig: (config: TaskSortConfig) => void;

  // View actions
  setViewMode: (mode: 'list' | 'grid') => void;

  // Getters
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByAssignee: (assigneeId: string) => Task[];
  getTaskById: (id: string) => Task | undefined;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: initialFilters,
      sortConfig: initialSortConfig,
      viewMode: 'list',

      addTask: (taskData) => {
        const id = uuidv4();
        const now = new Date();
        const newTask: Task = {
          ...taskData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        return id;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      moveTask: (id, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, status: newStatus, updatedAt: new Date() }
              : task
          ),
        }));
      },

      toggleTaskStatus: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const newStatus: TaskStatus =
              task.status === 'done' ? 'todo' : 'done';
            return { ...task, status: newStatus, updatedAt: new Date() };
          }),
        }));
      },

      toggleChecklistItem: (taskId, checklistItemId) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              checklist: task.checklist.map((item) =>
                item.id === checklistItemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
              updatedAt: new Date(),
            };
          }),
        }));
      },

      // Filter actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: initialFilters });
      },

      // Sort actions
      setSortConfig: (config) => {
        set({ sortConfig: config });
      },

      // View actions
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      getTasksByCategory: (categoryId) => {
        return get().tasks.filter((task) => task.categoryId === categoryId);
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getTasksByAssignee: (assigneeId) => {
        return get().tasks.filter((task) =>
          task.assigneeIds.includes(assigneeId)
        );
      },

      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      getFilteredTasks: () => {
        const { tasks, filters, sortConfig } = get();

        let filtered = tasks.filter((task) => {
          // Category filter
          if (filters.categoryId && task.categoryId !== filters.categoryId) {
            return false;
          }

          // Status filter
          if (filters.status && task.status !== filters.status) {
            return false;
          }

          // Priority filter
          if (filters.priority && task.priority !== filters.priority) {
            return false;
          }

          // Assignee filter
          if (
            filters.assigneeId &&
            !task.assigneeIds.includes(filters.assigneeId)
          ) {
            return false;
          }

          // Date range filter
          if (filters.dateFrom && new Date(task.dueDate) < filters.dateFrom) {
            return false;
          }
          if (filters.dateTo && new Date(task.dueDate) > filters.dateTo) {
            return false;
          }

          // Search query filter
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            return (
              task.title.toLowerCase().includes(query) ||
              task.description.toLowerCase().includes(query)
            );
          }

          return true;
        });

        // Sort tasks
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortConfig.field) {
            case 'dueDate':
              comparison =
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              break;
            case 'priority':
              comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
              break;
            case 'status':
              comparison = statusOrder[a.status] - statusOrder[b.status];
              break;
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'createdAt':
              comparison =
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime();
              break;
          }

          return sortConfig.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },
    }),
    {
      name: 'ecscs-tasks',
      partialize: (state) => ({
        tasks: state.tasks,
        viewMode: state.viewMode,
      }),
    }
  )
);
