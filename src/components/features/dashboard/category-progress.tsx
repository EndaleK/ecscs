import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/stores/task-store';
import { useCategoryStore } from '@/stores/category-store';
import { useSettingsStore } from '@/stores/settings-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  Building,
  Users,
  Package,
  HeartHandshake,
  Megaphone,
  Banknote,
  Utensils,
  Trophy,
  FolderKanban,
} from 'lucide-react';

// Icon mapping for category icons
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  building: Building,
  users: Users,
  package: Package,
  'heart-handshake': HeartHandshake,
  megaphone: Megaphone,
  banknote: Banknote,
  utensils: Utensils,
  trophy: Trophy,
};

interface CategoryProgressBarProps {
  name: string;
  nameAmharic: string;
  color: string;
  icon: string;
  completed: number;
  total: number;
}

function CategoryProgressBar({
  name,
  nameAmharic,
  color,
  icon,
  completed,
  total,
}: CategoryProgressBarProps) {
  const language = useSettingsStore((state) => state.language);
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const displayName = language === 'am' ? nameAmharic : name;

  const IconComponent = iconMap[icon] || FolderKanban;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComponent
              className="h-4 w-4"
              style={{ color }}
            />
          </div>
          <span className="text-sm font-medium truncate max-w-[150px]">
            {displayName}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {completed}/{total}
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out'
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function CategoryProgress() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const categories = useCategoryStore((state) => state.categories);

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const categoryTasks = tasks.filter(
        (task) => task.categoryId === category.id
      );
      const completedTasks = categoryTasks.filter(
        (task) => task.status === 'done'
      ).length;

      return {
        id: category.id,
        name: category.name,
        nameAmharic: category.nameAmharic,
        color: category.color,
        icon: category.icon,
        completed: completedTasks,
        total: categoryTasks.length,
      };
    });
  }, [tasks, categories]);

  // Sort by total tasks descending, then by completed percentage
  const sortedStats = useMemo(() => {
    return [...categoryStats].sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      const aPercentage = a.total > 0 ? a.completed / a.total : 0;
      const bPercentage = b.total > 0 ? b.completed / b.total : 0;
      return bPercentage - aPercentage;
    });
  }, [categoryStats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('dashboard.progressByCategory')}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedStats.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t('dashboard.noCategories')}
          </p>
        ) : (
          <div className="space-y-4">
            {sortedStats.map((category) => (
              <CategoryProgressBar
                key={category.id}
                name={category.name}
                nameAmharic={category.nameAmharic}
                color={category.color}
                icon={category.icon}
                completed={category.completed}
                total={category.total}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
