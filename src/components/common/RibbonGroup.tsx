import type { ReactNode } from 'react';

export function RibbonGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-stretch px-2">
      <div className="flex flex-1 items-center gap-0.5">{children}</div>
      <div className="mt-1 text-center text-[10px] uppercase tracking-wide text-app-muted">
        {label}
      </div>
    </div>
  );
}

export function RibbonDivider() {
  return <div className="mx-1 my-1 w-px self-stretch bg-app-border" aria-hidden="true" />;
}

export function VStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

export function HStack({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}
