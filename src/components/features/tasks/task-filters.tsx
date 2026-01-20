import { useTranslation } from "react-i18next";
import { X, Filter, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  TaskStatus,
  TaskPriority,
  Category,
  Contact,
} from "@/types";
import type { TaskFilters as TaskFiltersType } from "@/stores/task-store";
import {
  Button,
  Label,
  Select,
  SelectOption,
  Badge,
  Input,
} from "@/components/ui";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  categories: Category[];
  contacts: Contact[];
  onFilterChange: (filters: Partial<TaskFiltersType>) => void;
  onClearFilters: () => void;
  className?: string;
}

const priorityOptions: { value: TaskPriority | ""; labelKey: string }[] = [
  { value: "", labelKey: "tasks.filters.allPriorities" },
  { value: "low", labelKey: "tasks.priority.low" },
  { value: "medium", labelKey: "tasks.priority.medium" },
  { value: "high", labelKey: "tasks.priority.high" },
  { value: "urgent", labelKey: "tasks.priority.urgent" },
];

const statusOptions: { value: TaskStatus | ""; labelKey: string }[] = [
  { value: "", labelKey: "tasks.filters.allStatuses" },
  { value: "todo", labelKey: "tasks.status.todo" },
  { value: "in_progress", labelKey: "tasks.status.inProgress" },
  { value: "done", labelKey: "tasks.status.done" },
];

export function TaskFilters({
  filters,
  categories,
  contacts,
  onFilterChange,
  onClearFilters,
  className,
}: TaskFiltersProps) {
  const { t } = useTranslation();

  const hasActiveFilters =
    filters.categoryId ||
    filters.status ||
    filters.priority ||
    filters.assigneeId ||
    filters.dateFrom ||
    filters.dateTo;

  const activeFilterCount = [
    filters.categoryId,
    filters.status,
    filters.priority,
    filters.assigneeId,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t("tasks.filters.title")}</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            {t("tasks.filters.clearAll")}
          </Button>
        )}
      </div>

      {/* Filter controls */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Category filter */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t("tasks.filters.category")}</Label>
          <Select
            value={filters.categoryId || ""}
            onChange={(e) =>
              onFilterChange({
                categoryId: e.target.value || null,
              })
            }
          >
            <SelectOption value="">{t("tasks.filters.allCategories")}</SelectOption>
            {categories.map((category) => (
              <SelectOption key={category.id} value={category.id}>
                {category.name}
              </SelectOption>
            ))}
          </Select>
        </div>

        {/* Status filter */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t("tasks.filters.status")}</Label>
          <Select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                status: (e.target.value as TaskStatus) || null,
              })
            }
          >
            {statusOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectOption>
            ))}
          </Select>
        </div>

        {/* Priority filter */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t("tasks.filters.priority")}</Label>
          <Select
            value={filters.priority || ""}
            onChange={(e) =>
              onFilterChange({
                priority: (e.target.value as TaskPriority) || null,
              })
            }
          >
            {priorityOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectOption>
            ))}
          </Select>
        </div>

        {/* Assignee filter */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t("tasks.filters.assignee")}</Label>
          <Select
            value={filters.assigneeId || ""}
            onChange={(e) =>
              onFilterChange({
                assigneeId: e.target.value || null,
              })
            }
          >
            <SelectOption value="">{t("tasks.filters.allAssignees")}</SelectOption>
            {contacts.map((contact) => (
              <SelectOption key={contact.id} value={contact.id}>
                {contact.name}
              </SelectOption>
            ))}
          </Select>
        </div>

        {/* Date from */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t("tasks.filters.dateFrom")}</Label>
          <Input
            type="date"
            value={formatDateForInput(filters.dateFrom)}
            onChange={(e) =>
              onFilterChange({
                dateFrom: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </div>

        {/* Date to */}
        <div className="space-y-1.5">
          <Label className="text-xs">{t("tasks.filters.dateTo")}</Label>
          <Input
            type="date"
            value={formatDateForInput(filters.dateTo)}
            onChange={(e) =>
              onFilterChange({
                dateTo: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            {t("tasks.filters.active")}:
          </span>

          {filters.categoryId && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.id === filters.categoryId)?.name}
              <button
                onClick={() => onFilterChange({ categoryId: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {t(`tasks.status.${filters.status === "in_progress" ? "inProgress" : filters.status}`)}
              <button
                onClick={() => onFilterChange({ status: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.priority && (
            <Badge variant="secondary" className="gap-1">
              {t(`tasks.priority.${filters.priority}`)}
              <button
                onClick={() => onFilterChange({ priority: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.assigneeId && (
            <Badge variant="secondary" className="gap-1">
              {contacts.find((c) => c.id === filters.assigneeId)?.name}
              <button
                onClick={() => onFilterChange({ assigneeId: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {t("tasks.filters.from")}: {formatDateForInput(filters.dateFrom)}
              <button
                onClick={() => onFilterChange({ dateFrom: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {t("tasks.filters.to")}: {formatDateForInput(filters.dateTo)}
              <button
                onClick={() => onFilterChange({ dateTo: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskFilters;
