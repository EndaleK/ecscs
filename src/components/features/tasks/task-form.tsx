import * as React from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  Category,
  Contact,
  ChecklistItem,
} from "@/types";
import {
  Button,
  Input,
  Label,
  Select,
  SelectOption,
  Checkbox,
  Avatar,
  AvatarFallback,
  getInitials,
} from "@/components/ui";

interface TaskFormData {
  title: string;
  description: string;
  categoryId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assigneeIds: string[];
  checklist: ChecklistItem[];
  reminderDate: string | null;
}

interface TaskFormProps {
  initialData?: Task;
  categories: Category[];
  contacts: Contact[];
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const priorityOptions: { value: TaskPriority; labelKey: string }[] = [
  { value: "low", labelKey: "tasks.priority.low" },
  { value: "medium", labelKey: "tasks.priority.medium" },
  { value: "high", labelKey: "tasks.priority.high" },
  { value: "urgent", labelKey: "tasks.priority.urgent" },
];

const statusOptions: { value: TaskStatus; labelKey: string }[] = [
  { value: "todo", labelKey: "tasks.status.todo" },
  { value: "in_progress", labelKey: "tasks.status.inProgress" },
  { value: "done", labelKey: "tasks.status.done" },
];

const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export function TaskForm({
  initialData,
  categories,
  contacts,
  onSubmit,
  onCancel,
  isLoading = false,
}: TaskFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = React.useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    dueDate: formatDateForInput(initialData?.dueDate || new Date()),
    assigneeIds: initialData?.assigneeIds || [],
    checklist: initialData?.checklist || [],
    reminderDate: formatDateForInput(initialData?.reminderDate),
  });

  const [newChecklistItem, setNewChecklistItem] = React.useState("");

  const handleChange = (
    field: keyof TaskFormData,
    value: TaskFormData[keyof TaskFormData]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssigneeToggle = (contactId: string) => {
    setFormData((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(contactId)
        ? prev.assigneeIds.filter((id) => id !== contactId)
        : [...prev.assigneeIds, contactId],
    }));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newChecklistItem.trim(),
      completed: false,
    };

    setFormData((prev) => ({
      ...prev,
      checklist: [...prev.checklist, newItem],
    }));
    setNewChecklistItem("");
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== itemId),
    }));
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      categoryId: formData.categoryId,
      priority: formData.priority,
      status: formData.status,
      dueDate: new Date(formData.dueDate),
      assigneeIds: formData.assigneeIds,
      checklist: formData.checklist,
      reminderDate: formData.reminderDate
        ? new Date(formData.reminderDate)
        : null,
    };

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("tasks.form.title")} *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={t("tasks.form.titlePlaceholder")}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t("tasks.form.description")}</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder={t("tasks.form.descriptionPlaceholder")}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Category and Priority */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">{t("tasks.form.category")}</Label>
          <Select
            id="category"
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            <SelectOption value="">{t("tasks.form.selectCategory")}</SelectOption>
            {categories.map((category) => (
              <SelectOption key={category.id} value={category.id}>
                {category.name}
              </SelectOption>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">{t("tasks.form.priority")}</Label>
          <Select
            id="priority"
            value={formData.priority}
            onChange={(e) =>
              handleChange("priority", e.target.value as TaskPriority)
            }
          >
            {priorityOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectOption>
            ))}
          </Select>
        </div>
      </div>

      {/* Status and Due Date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">{t("tasks.form.status")}</Label>
          <Select
            id="status"
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as TaskStatus)
            }
          >
            {statusOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectOption>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">{t("tasks.form.dueDate")} *</Label>
          <div className="relative">
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Reminder Date */}
      <div className="space-y-2">
        <Label htmlFor="reminderDate">{t("tasks.form.reminder")}</Label>
        <div className="relative">
          <Input
            id="reminderDate"
            type="date"
            value={formData.reminderDate || ""}
            onChange={(e) =>
              handleChange("reminderDate", e.target.value || null)
            }
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("tasks.form.reminderHelp")}
        </p>
      </div>

      {/* Assignees */}
      <div className="space-y-2">
        <Label>{t("tasks.form.assignees")}</Label>
        <div className="rounded-md border border-input p-3">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("tasks.form.noContacts")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {contacts.map((contact) => {
                const isSelected = formData.assigneeIds.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleAssigneeToggle(contact.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    {contact.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <Label>{t("tasks.form.checklist")}</Label>
        <div className="space-y-2">
          {/* Existing items */}
          {formData.checklist.length > 0 && (
            <div className="space-y-1 rounded-md border border-input p-2">
              {formData.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded p-1.5 hover:bg-muted/50"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleChecklistItem(item.id)}
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      item.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {item.text}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new item */}
          <div className="flex gap-2">
            <Input
              placeholder={t("tasks.form.addChecklistItem")}
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddChecklistItem();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddChecklistItem}
              disabled={!newChecklistItem.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isLoading || !formData.title.trim()}>
          {isLoading
            ? t("common.loading")
            : initialData
            ? t("common.save")
            : t("tasks.form.createTask")}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
