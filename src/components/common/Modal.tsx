import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  icon?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer, width = 520, icon }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface text-app-text shadow-2xl animate-scale-in"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-app-border px-5 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            {icon}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-app-muted transition-colors hover:bg-app-surface-2 hover:text-app-text"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-app-border px-5 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
