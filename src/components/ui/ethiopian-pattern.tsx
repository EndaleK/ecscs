import { cn } from '@/lib/utils';

// Heritage & Celebration Ethiopian color palette
export const ethiopianColors = {
  // Primary - Navy/Deep Blue (Professional FIFA-style)
  navy: '#1A2B48',
  navyLight: '#2D4A6F',
  navyDark: '#0F1A2E',

  // Ethiopian Flag - Vibrant Colors
  green: '#2E7D32',
  greenLight: '#4CAF50',
  greenDark: '#1B5E20',

  yellow: '#FDD835',
  yellowLight: '#FFEB3B',
  yellowDark: '#F9A825',

  red: '#D32F2F',
  redLight: '#EF5350',
  redDark: '#C62828',

  // Anniversary Gold - Special 30 Years accent
  gold: '#C5A059',
  goldLight: '#D4B76A',
  goldDark: '#A68A3C',

  // Legacy aliases for backward compatibility
  forestGreen: '#2E7D32',
  warmGold: '#FDD835',
  terracotta: '#D32F2F',
};

interface EthiopianPatternProps {
  className?: string;
  opacity?: number;
  variant?: 'default' | 'light' | 'dark';
}

// Ethiopian textile-inspired geometric pattern background
export function EthiopianPattern({
  className = "",
  opacity = 0.03,
  variant = 'default'
}: EthiopianPatternProps) {
  const baseOpacity = variant === 'light' ? opacity * 0.5 : variant === 'dark' ? opacity * 1.5 : opacity;

  return (
    <svg className={cn("pointer-events-none", className)} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Main diamond pattern inspired by Ethiopian weaving */}
        <pattern id="ethiopian-pattern-main" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Large center diamond - forest green */}
          <path d="M40 10 L60 40 L40 70 L20 40 Z" fill={ethiopianColors.forestGreen} fillOpacity={baseOpacity * 2} />

          {/* Inner diamond - warm gold */}
          <path d="M40 20 L52 40 L40 60 L28 40 Z" fill={ethiopianColors.warmGold} fillOpacity={baseOpacity * 2.5} />

          {/* Center small diamond - terracotta */}
          <path d="M40 30 L46 40 L40 50 L34 40 Z" fill={ethiopianColors.terracotta} fillOpacity={baseOpacity * 3} />

          {/* Corner triangles - creating the zigzag effect */}
          <path d="M0 0 L20 0 L0 20 Z" fill={ethiopianColors.forestGreen} fillOpacity={baseOpacity * 1.5} />
          <path d="M80 0 L80 20 L60 0 Z" fill={ethiopianColors.forestGreen} fillOpacity={baseOpacity * 1.5} />
          <path d="M0 80 L0 60 L20 80 Z" fill={ethiopianColors.forestGreen} fillOpacity={baseOpacity * 1.5} />
          <path d="M80 80 L60 80 L80 60 Z" fill={ethiopianColors.forestGreen} fillOpacity={baseOpacity * 1.5} />

          {/* Small accent diamonds at corners */}
          <path d="M0 40 L10 30 L20 40 L10 50 Z" fill={ethiopianColors.warmGold} fillOpacity={baseOpacity * 2} />
          <path d="M80 40 L70 30 L60 40 L70 50 Z" fill={ethiopianColors.warmGold} fillOpacity={baseOpacity * 2} />
          <path d="M40 0 L50 10 L40 20 L30 10 Z" fill={ethiopianColors.terracotta} fillOpacity={baseOpacity * 2} />
          <path d="M40 80 L50 70 L40 60 L30 70 Z" fill={ethiopianColors.terracotta} fillOpacity={baseOpacity * 2} />

          {/* Zigzag border lines */}
          <path d="M0 0 L10 10 L0 20 M20 0 L10 10 L20 20" stroke={ethiopianColors.forestGreen} strokeWidth="1" fill="none" strokeOpacity={baseOpacity * 3} />
          <path d="M60 0 L70 10 L60 20 M80 0 L70 10 L80 20" stroke={ethiopianColors.forestGreen} strokeWidth="1" fill="none" strokeOpacity={baseOpacity * 3} />
          <path d="M0 60 L10 70 L0 80 M20 60 L10 70 L20 80" stroke={ethiopianColors.forestGreen} strokeWidth="1" fill="none" strokeOpacity={baseOpacity * 3} />
          <path d="M60 60 L70 70 L60 80 M80 60 L70 70 L80 80" stroke={ethiopianColors.forestGreen} strokeWidth="1" fill="none" strokeOpacity={baseOpacity * 3} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ethiopian-pattern-main)" />
    </svg>
  );
}

interface EthiopianBorderProps {
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

// Horizontal Ethiopian pattern border/divider
export function EthiopianBorder({ className = "", height = 'md' }: EthiopianBorderProps) {
  const heightClass = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  }[height];

  return (
    <div className={cn(`w-full overflow-hidden ${heightClass}`, className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="border-diamonds-shared" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0 L24 8 L16 16 L8 8 Z" fill={ethiopianColors.forestGreen} fillOpacity="0.15" />
            <path d="M16 4 L20 8 L16 12 L12 8 Z" fill={ethiopianColors.warmGold} fillOpacity="0.2" />
            <path d="M0 8 L8 0 L8 16 Z" fill={ethiopianColors.terracotta} fillOpacity="0.12" />
            <path d="M32 8 L24 0 L24 16 Z" fill={ethiopianColors.terracotta} fillOpacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#border-diamonds-shared)" />
      </svg>
    </div>
  );
}

interface PageBackgroundPatternProps {
  children: React.ReactNode;
  className?: string;
  showPattern?: boolean;
  patternOpacity?: number;
}

// Wrapper component for pages with Ethiopian pattern background
export function PageBackgroundPattern({
  children,
  className = "",
  showPattern = true,
  patternOpacity = 0.025
}: PageBackgroundPatternProps) {
  return (
    <div className={cn("relative min-h-full", className)}>
      {showPattern && (
        <>
          <div className="fixed inset-0 pointer-events-none z-0">
            <EthiopianPattern className="absolute inset-0" opacity={patternOpacity} />
          </div>
          {/* Subtle gradient overlay for better readability */}
          <div className="fixed inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/80 pointer-events-none z-0" />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Ethiopian-themed section header with decorative elements
interface EthiopianSectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function EthiopianSectionHeader({ title, subtitle, className = "" }: EthiopianSectionHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rotate-45 bg-primary/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-secondary/40" />
          <div className="w-1 h-1 rotate-45 bg-accent/40" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      <h2 className="text-2xl font-bold text-foreground text-center">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-center mt-1">{subtitle}</p>
      )}
      <div className="flex items-center gap-3 mt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rotate-45 bg-accent/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-secondary/40" />
          <div className="w-2 h-2 rotate-45 bg-primary/40" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>
    </div>
  );
}
