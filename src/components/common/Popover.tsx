import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface PopoverProps {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  width?: number;
  title?: string;
  ariaLabel?: string;
  onOpen?: () => void;
  showChevron?: boolean;
  className?: string;
}

/**
 * A click-to-open popover used throughout the ribbon for colour pickers,
 * font menus, etc. Uses `onMouseDown` + preventDefault on the trigger so the
 * editor selection is preserved while the menu opens.
 */
export function Popover({
  trigger,
  children,
  align = 'left',
  width = 220,
  title,
  ariaLabel,
  onOpen,
  showChevron = true,
  className = '',
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={open}
        className="ribbon-btn h-8 gap-1 px-2 text-sm"
        onMouseDown={(e) => {
          e.preventDefault();
          onOpen?.();
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
        {showChevron && <ChevronDown size={14} className="opacity-70" />}
      </button>
      {open && (
        <div
          className="absolute z-40 mt-1 rounded-lg border border-app-border bg-app-surface p-2 shadow-xl animate-scale-in"
          style={{ width, [align]: 0 }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {title && (
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-app-muted">
              {title}
            </div>
          )}
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
