import { cn } from "@/lib/utils";

interface SectionDividerProps {
  title?: string;
  className?: string;
}

/**
 * Ethiopian-styled section divider with diamond accents
 * Style: ——— ✦ TITLE ✦ ———
 */
export function SectionDivider({ title, className }: SectionDividerProps) {
  return (
    <div className={cn("flex items-center gap-2 my-4", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary to-secondary"></div>
      <span className="text-accent text-sm">✦</span>
      {title && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-1">
          {title}
        </span>
      )}
      <span className="text-accent text-sm">✦</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-destructive to-destructive"></div>
    </div>
  );
}

/**
 * Simple accent divider without title
 * Style: ——— ✦ ———
 */
export function AccentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary"></div>
      <span className="text-accent text-lg">✦</span>
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-destructive"></div>
    </div>
  );
}
