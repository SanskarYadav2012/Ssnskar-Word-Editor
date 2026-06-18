import { Omega } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';

const SYMBOLS =
  '© ® ™ § ¶ † ‡ • … ‰ € £ ¥ ¢ ° ± × ÷ ≈ ≠ ≤ ≥ ∞ √ ∑ ∏ ∫ ∂ µ π α β γ δ θ λ φ ω Ω Δ → ← ↑ ↓ ↔ ⇒ ⇔ ★ ☆ ♥ ♦ ♣ ♠ ✓ ✗ ☺ ☹ « » “ ” ‘ ’ — – ¡ ¿'
    .split(' ')
    .filter(Boolean);

export function SymbolPicker() {
  const editor = useEditor();
  const { modal, closeModal } = useUI();
  const open = modal === 'symbol';

  return (
    <Modal open={open} onClose={closeModal} title="Insert Symbol" icon={<Omega size={18} />} width={460}>
      <div className="grid grid-cols-10 gap-1">
        {SYMBOLS.map((sym, i) => (
          <button
            key={`${sym}-${i}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.insertSpecialChar(sym);
              closeModal();
            }}
            className="flex h-9 items-center justify-center rounded-md border border-app-border bg-app-surface-2 text-lg hover:border-app-accent hover:bg-app-ribbon-hover"
          >
            {sym}
          </button>
        ))}
      </div>
    </Modal>
  );
}
