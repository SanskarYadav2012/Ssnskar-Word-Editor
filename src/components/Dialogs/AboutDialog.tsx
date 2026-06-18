import { Info } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useUI } from '@/context/UIContext';
import { APP_NAME, APP_VERSION, COPYRIGHT, SOCIAL_LINKS } from '@/utils/constants';
import logoUrl from '/logo.png';

export function AboutDialog() {
  const { modal, closeModal } = useUI();
  const open = modal === 'about';

  return (
    <Modal open={open} onClose={closeModal} title={`About ${APP_NAME}`} icon={<Info size={18} />} width={460}>
      <div className="flex flex-col items-center text-center">
        <img src={logoUrl} alt={`${APP_NAME} logo`} className="h-24 w-24 rounded-2xl shadow-lg" />
        <h3 className="mt-3 text-lg font-semibold gold-text">{APP_NAME}</h3>
        <p className="text-sm text-app-muted">Version {APP_VERSION}</p>
        <p className="mt-3 max-w-sm text-sm text-app-text">
          A premium, cross-platform word processing application built with React, TypeScript,
          Electron, Capacitor and an optional Rust/WebAssembly performance core.
        </p>

        <div className="mt-4 w-full border-t border-app-border pt-3 text-left">
          <p className="mb-2 text-xs font-semibold uppercase text-app-muted">Follow Sanskar on:-</p>
          <div className="grid grid-cols-1 gap-1 text-sm">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between rounded px-2 py-1 hover:bg-app-surface-2"
              >
                <span className="text-app-muted">{link.label}</span>
                <span className="truncate pl-2 text-app-accent-strong">{link.display}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-app-muted">{COPYRIGHT}</p>
      </div>
    </Modal>
  );
}
