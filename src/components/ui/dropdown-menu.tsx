import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Circle } from "lucide-react";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(
  undefined
);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within a DropdownMenu provider"
    );
  }
  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, asChild, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useDropdownMenuContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setOpen(!open);
  };

  // Merge refs
  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref, triggerRef]
  );

  return (
    <button
      ref={mergedRef}
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useDropdownMenuContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Calculate position based on trigger element
  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const contentWidth = contentRef.current?.offsetWidth || 0;

      let left = rect.left;
      if (align === "center") {
        left = rect.left + rect.width / 2 - contentWidth / 2;
      } else if (align === "end") {
        left = rect.right - contentWidth;
      }

      setPosition({
        top: rect.bottom + sideOffset + window.scrollY,
        left: Math.max(8, left + window.scrollX),
      });
    }
  }, [open, align, sideOffset, triggerRef]);

  // Close on click outside
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
      }}
      role="menu"
      {...props}
    >
      {children}
    </div>,
    document.body
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, inset, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

interface DropdownMenuCheckboxItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, onCheckedChange, onClick, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onCheckedChange?.(!checked);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </button>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

interface DropdownMenuRadioItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

const DropdownMenuRadioItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuRadioItemProps
>(({ className, children, checked, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="menuitemradio"
    aria-checked={checked}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Circle className="h-2 w-2 fill-current" />}
    </span>
    {children}
  </button>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    role="separator"
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// Submenu support
interface DropdownMenuSubContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextValue | undefined>(
  undefined
);

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenuSubContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuSubContext.Provider>
  );
}

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => {
  const context = React.useContext(DropdownMenuSubContext);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-muted hover:bg-muted",
        inset && "pl-8",
        className
      )}
      onMouseEnter={() => context?.setOpen(true)}
      onMouseLeave={() => context?.setOpen(false)}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </button>
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(DropdownMenuSubContext);

  if (!context?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg",
        className
      )}
      onMouseEnter={() => context.setOpen(true)}
      onMouseLeave={() => context.setOpen(false)}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
