import type { ReactNode } from 'react';

interface RibbonButtonProps {
  icon: ReactNode;
  label?: string;
  tooltip: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  big?: boolean;
}

/**
 * Toolbar button. `onMouseDown` prevents default so clicking it does not blur
 * the editor (which would otherwise destroy the current text selection before
 * the formatting command runs).
 */
export function RibbonButton({
  icon,
  label,
  tooltip,
  active = false,
  disabled = false,
  onClick,
  big = false,
}: RibbonButtonProps) {
  return (
    <button
      type="button"
      title={tooltip}
      aria-label={tooltip}
      aria-pressed={active}
      data-active={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={
        big
          ? 'ribbon-btn flex-col gap-1 px-3 py-1.5 text-[11px] font-medium'
          : 'ribbon-btn h-8 min-w-8 px-1.5 text-sm'
      }
    >
      {icon}
      {label && <span className={big ? '' : 'ml-1'}>{label}</span>}
    </button>
  );
}
