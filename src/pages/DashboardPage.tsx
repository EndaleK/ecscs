import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/stores/task-store';
import { KPIGrid } from '@/components/features/dashboard/kpi-grid';
import { ProgressRingWithStats } from '@/components/features/dashboard/progress-ring';
import { CategoryProgress } from '@/components/features/dashboard/category-progress';
import { UpcomingTasks } from '@/components/features/dashboard/upcoming-tasks';
import { RecentActivity } from '@/components/features/dashboard/recent-activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { Calendar, PartyPopper, Trophy } from 'lucide-react';

// Tournament event date - ECSCS 30th Anniversary 2026
const TOURNAMENT_DATE = new Date('2026-07-15');

// Simple section divider matching the reference style: ——— ✦ TITLE ✦ ———
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary to-secondary"></div>
      <span className="text-accent text-sm">✦</span>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</span>
      <span className="text-accent text-sm">✦</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-destructive to-destructive"></div>
    </div>
  );
}

function EventCountdown() {
  const { t } = useTranslation();
  const now = new Date();
  const timeDiff = TOURNAMENT_DATE.getTime() - now.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  const isEventPassed = daysUntil < 0;
  const isEventToday = daysUntil === 0;

  if (isEventPassed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Ethiopian flag stripe at top */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-secondary"></div>
        <div className="flex-1 bg-accent"></div>
        <div className="flex-1 bg-destructive"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className="hidden sm:flex p-4 rounded-xl bg-secondary/10">
            {isEventToday ? (
              <PartyPopper className="h-10 w-10 text-secondary" />
            ) : (
              <Trophy className="h-10 w-10 text-secondary" />
            )}
          </div>

          <div className="flex-1">
            {isEventToday ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-secondary uppercase tracking-wider">Tournament Day!</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {t('dashboard.eventToday')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('dashboard.eventTodayMessage')}
                </p>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-secondary uppercase tracking-wider mb-1">
                  ECSCS 30th Anniversary
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">{daysUntil}</span>
                  <span className="text-lg text-muted-foreground">{t('dashboard.daysUntilEvent')}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('dashboard.countdownMessage')}
                </p>
              </>
            )}
          </div>

          {/* Calendar badge on right */}
          <div className="hidden md:flex items-center">
            <div className="text-center p-4 rounded-xl bg-muted border border-border">
              <Calendar className="h-6 w-6 text-secondary mx-auto mb-1" />
              <div className="text-xs font-medium text-muted-foreground">July 2026</div>
              <div className="text-sm font-bold text-foreground">Edmonton</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeSection() {
  const { t } = useTranslation();

  // Get current time to determine greeting
  const hour = new Date().getHours();
  let greeting = t('dashboard.greeting.evening');
  if (hour < 12) {
    greeting = t('dashboard.greeting.morning');
  } else if (hour < 17) {
    greeting = t('dashboard.greeting.afternoon');
  }

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">{greeting}</h1>
      <p className="text-muted-foreground mt-1">
        {t('dashboard.welcomeMessage')}
      </p>
    </div>
  );
}

function OverallProgress() {
  const { t } = useTranslation();
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'done').length;
    return { total, completed };
  }, [tasks]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t('dashboard.overallProgress')}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <ProgressRingWithStats
          completed={stats.completed}
          total={stats.total}
          size={160}
          strokeWidth={14}
          title={t('dashboard.tasksComplete')}
        />
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-full">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Event Countdown - Hero Banner */}
        <EventCountdown />

        {/* KPI Grid - Key Metrics at a Glance */}
        <section>
          <SectionDivider title="Key Metrics" />
          <KPIGrid />
        </section>

        {/* Main Content Grid - Intuitive 3-column layout */}
        <section>
          <SectionDivider title="Details & Activity" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Progress Overview (narrower) */}
            <div className="lg:col-span-3 space-y-6">
              <OverallProgress />
            </div>

            {/* Center Column - Category Progress (wider, most important) */}
            <div className="lg:col-span-5">
              <CategoryProgress />
            </div>

            {/* Right Column - Upcoming Tasks */}
            <div className="lg:col-span-4">
              <UpcomingTasks />
            </div>
          </div>
        </section>

        {/* Recent Activity - Full Width */}
        <section>
          <SectionDivider title="Recent Activity" />
          <RecentActivity />
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
