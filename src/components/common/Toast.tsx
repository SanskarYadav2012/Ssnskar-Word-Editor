import { useUI } from '@/context/UIContext';

export function Toast() {
  const { toast } = useUI();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed bottom-12 left-1/2 z-[60] -translate-x-1/2 animate-fade-in">
      <div className="pointer-events-auto rounded-full bg-app-accent-strong px-4 py-2 text-sm font-medium text-white shadow-lg">
        {toast}
      </div>
    </div>
  );
}
