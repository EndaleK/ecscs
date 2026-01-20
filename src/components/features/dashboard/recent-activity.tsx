import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/stores/task-store';
import { useVolunteerStore } from '@/stores/volunteer-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateRelative } from '@/lib/utils';
import { useMemo } from 'react';
import { CheckCircle, Plus, UserPlus, Clock, Activity } from 'lucide-react';

type ActivityType = 'task_completed' | 'task_created' | 'task_updated' | 'volunteer_added';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  color: string;
}

interface ActivityItemProps {
  activity: ActivityItem;
}

function ActivityIcon({ type }: { type: ActivityType }) {
  switch (type) {
    case 'task_completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'task_created':
      return <Plus className="h-4 w-4" />;
    case 'task_updated':
      return <Clock className="h-4 w-4" />;
    case 'volunteer_added':
      return <UserPlus className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

function getActivityColor(type: ActivityType): string {
  switch (type) {
    case 'task_completed':
      return '#10B981';
    case 'task_created':
      return '#3B82F6';
    case 'task_updated':
      return '#F59E0B';
    case 'volunteer_added':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
}

function ActivityItemComponent({ activity }: ActivityItemProps) {
  const { t } = useTranslation();

  const activityLabels: Record<ActivityType, string> = {
    task_completed: t('dashboard.activity.taskCompleted'),
    task_created: t('dashboard.activity.taskCreated'),
    task_updated: t('dashboard.activity.taskUpdated'),
    volunteer_added: t('dashboard.activity.volunteerAdded'),
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      {/* Icon */}
      <div
        className="p-2 rounded-full shrink-0"
        style={{ backgroundColor: `${activity.color}20` }}
      >
        <div style={{ color: activity.color }}>
          <ActivityIcon type={activity.type} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-xs text-muted-foreground">
          {activityLabels[activity.type]}
        </p>
      </div>

      {/* Timestamp */}
      <span className="text-xs text-muted-foreground shrink-0">
        {formatDateRelative(activity.timestamp)}
      </span>
    </div>
  );
}

export function RecentActivity() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);
  const volunteers = useVolunteerStore((state) => state.volunteers);

  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add task activities
    tasks.forEach((task) => {
      // Completed tasks
      if (task.status === 'done') {
        items.push({
          id: `completed-${task.id}`,
          type: 'task_completed',
          title: task.title,
          timestamp: new Date(task.updatedAt),
          color: getActivityColor('task_completed'),
        });
      }

      // Created tasks (use createdAt)
      items.push({
        id: `created-${task.id}`,
        type: 'task_created',
        title: task.title,
        timestamp: new Date(task.createdAt),
        color: getActivityColor('task_created'),
      });

      // Updated tasks (if different from created)
      const createdAt = new Date(task.createdAt).getTime();
      const updatedAt = new Date(task.updatedAt).getTime();
      if (task.status !== 'done' && updatedAt > createdAt + 1000) {
        items.push({
          id: `updated-${task.id}`,
          type: 'task_updated',
          title: task.title,
          timestamp: new Date(task.updatedAt),
          color: getActivityColor('task_updated'),
        });
      }
    });

    // Add volunteer activities
    volunteers.forEach((volunteer) => {
      items.push({
        id: `volunteer-${volunteer.id}`,
        type: 'volunteer_added',
        title: volunteer.name,
        timestamp: new Date(volunteer.registeredAt),
        color: getActivityColor('volunteer_added'),
      });
    });

    // Sort by timestamp descending and take top 10
    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [tasks, volunteers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noRecentActivity')}
            </p>
          </div>
        ) : (
          <div>
            {activities.map((activity) => (
              <ActivityItemComponent key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
