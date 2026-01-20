import { useTranslation } from "react-i18next";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Task, Contact, Category } from "@/types";
import type { TaskSortConfig } from "@/stores/task-store";
import {
  Card,
  Badge,
  Avatar,
  AvatarFallback,
  getInitials,
  Button,
  Input,
} from "@/components/ui";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  contacts: Contact[];
  sortConfig: TaskSortConfig;
  onSortChange: (config: TaskSortConfig) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onToggleComplete: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  className?: string;
}

const priorityConfig: Record<
  Task["priority"],
  { label: string; variant: "default" | "secondary" | "warning" | "danger" }
> = {
  low: { label: "tasks.priority.low", variant: "secondary" },
  medium: { label: "tasks.priority.medium", variant: "default" },
  high: { label: "tasks.priority.high", variant: "warning" },
  urgent: { label: "tasks.priority.urgent", variant: "danger" },
};

const statusConfig: Record<Task["status"], { label: string; className: string }> = {
  todo: { label: "tasks.status.todo", className: "text-gray-500" },
  in_progress: { label: "tasks.status.inProgress", className: "text-blue-500" },
  done: { label: "tasks.status.done", className: "text-green-500" },
};

type SortField = TaskSortConfig["field"];

export function TaskList({
  tasks,
  categories,
  contacts,
  sortConfig,
  onSortChange,
  onSearch,
  searchQuery,
  onToggleComplete,
  onTaskClick,
  className,
}: TaskListProps) {
  const { t } = useTranslation();

  const getCategoryById = (id: string) =>
    categories.find((c) => c.id === id);

  const getContactsByIds = (ids: string[]) =>
    contacts.filter((c) => ids.includes(c.id));

  const handleSort = (field: SortField) => {
    if (sortConfig.field === field) {
      onSortChange({
        field,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      onSortChange({ field, direction: "asc" });
    }
  };

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => {
    const isActive = sortConfig.field === field;
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 text-xs font-medium",
          isActive && "bg-muted"
        )}
        onClick={() => handleSort(field)}
      >
        {label}
        {isActive ? (
          sortConfig.direction === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3" />
          ) : (
            <ArrowDown className="ml-1 h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
        )}
      </Button>
    );
  };

  const isOverdue = (task: Task) => {
    if (task.status === "done") return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and sort controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("tasks.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-2 text-sm text-muted-foreground">
            {t("tasks.sortBy")}:
          </span>
          <SortButton field="dueDate" label={t("tasks.dueDate")} />
          <SortButton field="priority" label={t("tasks.priority.label")} />
          <SortButton field="status" label={t("tasks.status.label")} />
          <SortButton field="title" label={t("tasks.title")} />
        </div>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">{t("tasks.noTasks")}</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const category = getCategoryById(task.categoryId);
            const assignees = getContactsByIds(task.assigneeIds);
            const priorityInfo = priorityConfig[task.priority];
            const statusInfo = statusConfig[task.status];
            const taskIsOverdue = isOverdue(task);
            const checklistProgress =
              task.checklist.length > 0
                ? {
                    completed: task.checklist.filter((i) => i.completed).length,
                    total: task.checklist.length,
                  }
                : null;

            return (
              <Card
                key={task.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-sm",
                  task.status === "done" && "opacity-60"
                )}
                onClick={() => onTaskClick(task)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className="flex-shrink-0"
                  >
                    {task.status === "done" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 cursor-pointer" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                    )}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={cn(
                          "font-medium truncate",
                          task.status === "done" && "line-through"
                        )}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={priorityInfo.variant} className="text-xs">
                          {t(priorityInfo.label)}
                        </Badge>
                        {category && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: category.color,
                              color: category.color,
                            }}
                          >
                            {category.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {/* Status */}
                      <span className={cn("flex items-center gap-1", statusInfo.className)}>
                        <span className={cn("h-2 w-2 rounded-full",
                          task.status === "todo" && "bg-gray-500",
                          task.status === "in_progress" && "bg-blue-500",
                          task.status === "done" && "bg-green-500"
                        )} />
                        {t(statusInfo.label)}
                      </span>

                      {/* Due date */}
                      <span
                        className={cn(
                          taskIsOverdue && "text-destructive font-medium"
                        )}
                      >
                        {taskIsOverdue && t("tasks.overdue") + ": "}
                        {formatDate(task.dueDate, "PP")}
                      </span>

                      {/* Checklist progress */}
                      {checklistProgress && (
                        <span>
                          {checklistProgress.completed}/{checklistProgress.total}{" "}
                          {t("tasks.checklistItems")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assignees */}
                  {assignees.length > 0 && (
                    <div className="flex -space-x-2 flex-shrink-0">
                      {assignees.slice(0, 3).map((contact) => (
                        <Avatar
                          key={contact.id}
                          size="sm"
                          className="border-2 border-background"
                        >
                          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {assignees.length > 3 && (
                        <Avatar size="sm" className="border-2 border-background">
                          <AvatarFallback className="text-xs">
                            +{assignees.length - 3}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results count */}
      {tasks.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {t("tasks.showingTasks", { count: tasks.length })}
        </p>
      )}
    </div>
  );
}

export default TaskList;
