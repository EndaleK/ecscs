import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

function getColorByPercentage(percentage: number): string {
  if (percentage >= 70) {
    return '#10B981'; // green
  } else if (percentage >= 40) {
    return '#F59E0B'; // yellow
  } else {
    return '#EF4444'; // red
  }
}

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  className,
  showLabel = true,
  label,
}: ProgressRingProps) {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;

  const color = getColorByPercentage(normalizedPercentage);

  // Center coordinates
  const center = size / 2;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />

        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>

      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color }}
          >
            {Math.round(normalizedPercentage)}%
          </span>
          {label && (
            <span className="text-xs text-muted-foreground mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface ProgressRingWithStatsProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
}

export function ProgressRingWithStats({
  completed,
  total,
  size = 140,
  strokeWidth = 12,
  className,
  title,
}: ProgressRingWithStatsProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <ProgressRing
        percentage={percentage}
        size={size}
        strokeWidth={strokeWidth}
        label={title}
      />
      <div className="mt-3 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{completed}</span>
          {' / '}
          <span>{total}</span>
        </p>
      </div>
    </div>
  );
}
