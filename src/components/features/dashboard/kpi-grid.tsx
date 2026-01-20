import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/stores/task-store';
import { useEventStore } from '@/stores/event-store';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { useCategoryStore } from '@/stores/category-store';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ListTodo,
  Calendar,
  Users,
  FolderKanban,
} from 'lucide-react';
import { useMemo } from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}

function KPICard({ title, value, icon, color, bgColor, subtitle }: KPICardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="p-3 rounded-xl shadow-sm"
          style={{ backgroundColor: bgColor }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function KPIGrid() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const events = useEventStore((state) => state.events);
  const volunteers = useVolunteerStore((state) => state.volunteers);
  const categories = useCategoryStore((state) => state.categories);

  const stats = useMemo(() => {
    const now = new Date();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'done').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length;
    const overdueTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return task.status !== 'done' && dueDate < now;
    }).length;

    // Count upcoming events (events starting in the future)
    const upcomingEvents = events.filter((event) => {
      const startDate = new Date(event.startDate);
      return startDate > now;
    }).length;

    // Task counts by category
    const tasksByCategory = categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      count: tasks.filter((task) => task.categoryId === category.id).length,
    }));

    const totalVolunteers = volunteers.length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      upcomingEvents,
      tasksByCategory,
      totalVolunteers,
    };
  }, [tasks, events, volunteers, categories]);

  // Heritage & Celebration themed color palette
  const kpiColors = {
    total: { color: '#1A2B48', bg: '#1A2B4815' },      // Navy primary
    completed: { color: '#2E7D32', bg: '#2E7D3215' },  // Vibrant green
    inProgress: { color: '#F9A825', bg: '#FDD83520' }, // Golden yellow (dark for text)
    overdue: { color: '#D32F2F', bg: '#D32F2F15' },    // Energetic red
    events: { color: '#8B5CF6', bg: '#8B5CF615' },     // Purple
    volunteers: { color: '#06B6D4', bg: '#06B6D415' }, // Cyan
    categories: { color: '#C5A059', bg: '#C5A05915' }, // Anniversary gold
  };

  return (
    <div className="space-y-6">
      {/* Main KPIs - Primary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('dashboard.totalTasks')}
          value={stats.totalTasks}
          icon={<ListTodo className="h-6 w-6" />}
          color={kpiColors.total.color}
          bgColor={kpiColors.total.bg}
        />
        <KPICard
          title={t('dashboard.completedTasks')}
          value={stats.completedTasks}
          icon={<CheckCircle className="h-6 w-6" />}
          color={kpiColors.completed.color}
          bgColor={kpiColors.completed.bg}
          subtitle={
            stats.totalTasks > 0
              ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% ${t('dashboard.complete')}`
              : undefined
          }
        />
        <KPICard
          title={t('dashboard.inProgress')}
          value={stats.inProgressTasks}
          icon={<Clock className="h-6 w-6" />}
          color={kpiColors.inProgress.color}
          bgColor={kpiColors.inProgress.bg}
        />
        <KPICard
          title={t('dashboard.overdue')}
          value={stats.overdueTasks}
          icon={<AlertTriangle className="h-6 w-6" />}
          color={kpiColors.overdue.color}
          bgColor={kpiColors.overdue.bg}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title={t('dashboard.upcomingEvents')}
          value={stats.upcomingEvents}
          icon={<Calendar className="h-6 w-6" />}
          color={kpiColors.events.color}
          bgColor={kpiColors.events.bg}
        />
        <KPICard
          title={t('dashboard.volunteers')}
          value={stats.totalVolunteers}
          icon={<Users className="h-6 w-6" />}
          color={kpiColors.volunteers.color}
          bgColor={kpiColors.volunteers.bg}
        />
        <KPICard
          title={t('dashboard.categories')}
          value={stats.tasksByCategory.length}
          icon={<FolderKanban className="h-6 w-6" />}
          color={kpiColors.categories.color}
          bgColor={kpiColors.categories.bg}
        />
      </div>
    </div>
  );
}
