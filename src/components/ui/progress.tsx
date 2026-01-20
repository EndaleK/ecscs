import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, size = "md", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-4",
    };

    return (
      <div className={cn("relative", className)} {...props}>
        <div
          ref={ref}
          className={cn(
            "w-full overflow-hidden rounded-full bg-muted",
            sizeClasses[size]
          )}
        >
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="absolute right-0 -top-6 text-sm font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

// Circular progress / KPI Ring component
export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
  trackColor?: string;
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 120,
      strokeWidth = 8,
      showLabel = true,
      color,
      trackColor,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          ref={ref}
          className={cn("transform -rotate-90", className)}
          width={size}
          height={size}
          {...props}
        >
          {/* Background circle (track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor || "currentColor"}
            strokeWidth={strokeWidth}
            className={cn(!trackColor && "text-muted")}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color || "currentColor"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              "transition-all duration-300 ease-in-out",
              !color && "text-primary"
            )}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
);
ProgressRing.displayName = "ProgressRing";

export { Progress, ProgressRing };
