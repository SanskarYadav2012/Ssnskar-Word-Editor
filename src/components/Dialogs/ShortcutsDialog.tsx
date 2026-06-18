import { Keyboard } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useUI } from '@/context/UIContext';
import { KEYBOARD_SHORTCUTS } from '@/utils/constants';

export function ShortcutsDialog() {
  const { modal, closeModal } = useUI();
  const open = modal === 'shortcuts';

  return (
    <Modal open={open} onClose={closeModal} title="Keyboard Shortcuts" icon={<Keyboard size={18} />} width={420}>
      <div className="divide-y divide-app-border">
        {KEYBOARD_SHORTCUTS.map((s) => (
          <div key={s.keys} className="flex items-center justify-between py-2 text-sm">
            <span className="text-app-text">{s.action}</span>
            <kbd className="rounded border border-app-border bg-app-surface-2 px-2 py-0.5 font-mono text-xs">
              {s.keys}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
