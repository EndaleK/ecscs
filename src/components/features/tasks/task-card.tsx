import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Edit,
  Trash2,
  CheckSquare,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Task, Contact, Category } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarFallback,
  getInitials,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Progress,
} from "@/components/ui";

interface TaskCardProps {
  task: Task;
  category?: Category;
  assignees: Contact[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (task: Task) => void;
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
  todo: { label: "tasks.status.todo", className: "bg-gray-500" },
  in_progress: { label: "tasks.status.inProgress", className: "bg-blue-500" },
  done: { label: "tasks.status.done", className: "bg-green-500" },
};

export function TaskCard({
  task,
  category,
  assignees,
  onEdit,
  onDelete,
  onClick,
  className,
}: TaskCardProps) {
  const { t } = useTranslation();

  const priorityInfo = priorityConfig[task.priority];
  const statusInfo = statusConfig[task.status];

  const checklistProgress = React.useMemo(() => {
    if (task.checklist.length === 0) return null;
    const completed = task.checklist.filter((item) => item.completed).length;
    return {
      completed,
      total: task.checklist.length,
      percentage: Math.round((completed / task.checklist.length) * 100),
    };
  }, [task.checklist]);

  const isOverdue = React.useMemo(() => {
    if (task.status === "done") return false;
    return new Date(task.dueDate) < new Date();
  }, [task.dueDate, task.status]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click when clicking on actions
    if ((e.target as HTMLElement).closest("[data-action]")) {
      return;
    }
    onClick?.(task);
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        task.status === "done" && "opacity-60",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header with priority and actions */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={priorityInfo.variant}>
              {t(priorityInfo.label)}
            </Badge>
            {category && (
              <Badge
                variant="outline"
                style={{
                  borderColor: category.color,
                  color: category.color,
                }}
              >
                {category.name}
              </Badge>
            )}
          </div>
          <div data-action>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t("common.actions")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(task.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-2 font-semibold leading-tight",
            task.status === "done" && "line-through"
          )}
        >
          {task.title}
        </h3>

        {/* Description preview */}
        {task.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        {/* Checklist progress */}
        {checklistProgress && (
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                {t("tasks.checklist")}
              </span>
              <span>
                {checklistProgress.completed}/{checklistProgress.total}
              </span>
            </div>
            <Progress value={checklistProgress.percentage} className="h-1.5" />
          </div>
        )}

        {/* Due date */}
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Calendar className="h-3 w-3" />
          <span>
            {isOverdue && t("tasks.overdue") + ": "}
            {formatDate(task.dueDate, "PP")}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-4 py-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={cn("h-2 w-2 rounded-full", statusInfo.className)}
          />
          <span className="text-xs text-muted-foreground">
            {t(statusInfo.label)}
          </span>
        </div>

        {/* Assignees */}
        {assignees.length > 0 && (
          <div className="flex -space-x-2">
            {assignees.slice(0, 3).map((contact) => (
              <Avatar key={contact.id} size="sm" className="border-2 border-background">
                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
              </Avatar>
            ))}
            {assignees.length > 3 && (
              <Avatar size="sm" className="border-2 border-background">
                <AvatarFallback>+{assignees.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default TaskCard;
