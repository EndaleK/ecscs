import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Edit,
  Trash2,
  CheckSquare,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatDateRelative } from "@/lib/utils";
import type { Task, Contact, Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  getInitials,
  Progress,
  Checkbox,
} from "@/components/ui";
import { TaskForm } from "./task-form";

interface TaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  assignees: Contact[];
  categories: Category[];
  contacts: Contact[];
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onToggleChecklistItem: (taskId: string, checklistItemId: string) => void;
}

const priorityConfig: Record<
  Task["priority"],
  { label: string; variant: "default" | "secondary" | "warning" | "danger"; icon?: typeof AlertTriangle }
> = {
  low: { label: "tasks.priority.low", variant: "secondary" },
  medium: { label: "tasks.priority.medium", variant: "default" },
  high: { label: "tasks.priority.high", variant: "warning" },
  urgent: { label: "tasks.priority.urgent", variant: "danger", icon: AlertTriangle },
};

const statusConfig: Record<Task["status"], { label: string; className: string }> = {
  todo: { label: "tasks.status.todo", className: "bg-gray-500" },
  in_progress: { label: "tasks.status.inProgress", className: "bg-blue-500" },
  done: { label: "tasks.status.done", className: "bg-green-500" },
};

export function TaskDialog({
  task,
  open,
  onOpenChange,
  category,
  assignees,
  categories,
  contacts,
  onUpdate,
  onDelete,
  onToggleChecklistItem,
}: TaskDialogProps) {
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Reset edit mode when dialog closes or task changes
  React.useEffect(() => {
    if (!open) {
      setIsEditMode(false);
      setShowDeleteConfirm(false);
    }
  }, [open]);

  if (!task) return null;

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

  const isOverdue =
    task.status !== "done" && new Date(task.dueDate) < new Date();

  const handleFormSubmit = (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    onUpdate(task.id, data);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isEditMode ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("tasks.dialog.editTask")}</DialogTitle>
            </DialogHeader>
            <TaskForm
              initialData={task}
              categories={categories}
              contacts={contacts}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsEditMode(false)}
            />
          </>
        ) : showDeleteConfirm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                {t("tasks.dialog.deleteConfirmTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                {t("tasks.dialog.deleteConfirmMessage", { title: task.title })}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                {t("common.cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="pr-12">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={priorityInfo.variant}>
                  {priorityInfo.icon && (
                    <priorityInfo.icon className="mr-1 h-3 w-3" />
                  )}
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
                <div className="flex items-center gap-1">
                  <span
                    className={cn("h-2 w-2 rounded-full", statusInfo.className)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t(statusInfo.label)}
                  </span>
                </div>
              </div>
              <DialogTitle className={cn(task.status === "done" && "line-through")}>
                {task.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Description */}
              {task.description && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                    {t("tasks.dialog.description")}
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              {/* Due Date */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("tasks.dialog.dueDate")}:
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      isOverdue && "text-destructive font-medium"
                    )}
                  >
                    {isOverdue && t("tasks.overdue") + " - "}
                    {formatDate(task.dueDate, "PPP")}
                  </span>
                </div>
              </div>

              {/* Reminder */}
              {task.reminderDate && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t("tasks.dialog.reminder")}:
                  </span>
                  <span className="text-sm">
                    {formatDate(task.reminderDate, "PPP")}
                  </span>
                </div>
              )}

              {/* Assignees */}
              {assignees.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t("tasks.dialog.assignees")} ({assignees.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignees.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-2 rounded-full bg-muted px-3 py-1"
                      >
                        <Avatar size="sm">
                          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{contact.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {task.checklist.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {t("tasks.dialog.checklist")}
                      </span>
                    </div>
                    {checklistProgress && (
                      <span className="text-xs text-muted-foreground">
                        {checklistProgress.completed}/{checklistProgress.total} (
                        {checklistProgress.percentage}%)
                      </span>
                    )}
                  </div>
                  {checklistProgress && (
                    <Progress
                      value={checklistProgress.percentage}
                      className="mb-3 h-1.5"
                    />
                  )}
                  <div className="space-y-1 rounded-md border p-2">
                    {task.checklist.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-2 rounded p-1.5 hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() =>
                            onToggleChecklistItem(task.id, item.id)
                          }
                        />
                        <span
                          className={cn(
                            "text-sm",
                            item.completed &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
                <span>
                  {t("tasks.dialog.created")}:{" "}
                  {formatDateRelative(task.createdAt)}
                </span>
                <span>
                  {t("tasks.dialog.updated")}:{" "}
                  {formatDateRelative(task.updatedAt)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </Button>
              <Button onClick={() => setIsEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TaskDialog;
