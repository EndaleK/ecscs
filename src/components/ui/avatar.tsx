import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "idle" | "loading" | "loaded" | "error") => void;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"idle" | "loading" | "loaded" | "error">(
      src ? "loading" : "idle"
    );

    React.useEffect(() => {
      if (!src) {
        setStatus("idle");
        return;
      }

      setStatus("loading");

      const img = new Image();
      img.src = src;
      img.onload = () => {
        setStatus("loaded");
        onLoadingStatusChange?.("loaded");
      };
      img.onerror = () => {
        setStatus("error");
        onLoadingStatusChange?.("error");
      };

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }, [src, onLoadingStatusChange]);

    if (status !== "loaded") {
      return null;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, delayMs, ...props }, ref) => {
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs !== undefined) {
        const timer = setTimeout(() => setCanRender(true), delayMs);
        return () => clearTimeout(timer);
      }
    }, [delayMs]);

    if (!canRender) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

// Helper function to get initials from a name
export function getInitials(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export { Avatar, AvatarImage, AvatarFallback };
