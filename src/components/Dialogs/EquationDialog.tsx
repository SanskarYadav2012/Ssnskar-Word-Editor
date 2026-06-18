import { useState } from 'react';
import { Sigma } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';

const PRESETS = [
  'E = mc²',
  'a² + b² = c²',
  '∑ⁿᵢ₌₁ i = n(n+1)/2',
  '∫ f(x) dx',
  'x = (−b ± √(b²−4ac)) / 2a',
  'lim ₓ→∞ f(x)',
  'π r²',
  'Δy / Δx',
];

export function EquationDialog() {
  const editor = useEditor();
  const { modal, closeModal } = useUI();
  const open = modal === 'equation';
  const [value, setValue] = useState('E = mc²');

  const insert = (eq: string) => {
    editor.insertEquation(eq);
    closeModal();
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Insert Equation"
      icon={<Sigma size={18} />}
      width={460}
      footer={
        <>
          <button onClick={closeModal} className="rounded-md border border-app-border px-3 py-1.5 text-sm hover:bg-app-surface-2">
            Cancel
          </button>
          <button onClick={() => insert(value)} className="rounded-md bg-app-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-app-accent-strong">
            Insert
          </button>
        </>
      }
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mb-3 w-full rounded-md border border-app-border bg-app-surface-2 px-3 py-2 font-serif text-sm italic outline-none focus:border-app-accent"
      />
      <p className="mb-2 text-xs font-semibold uppercase text-app-muted">Quick equations</p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((eq) => (
          <button
            key={eq}
            onClick={() => setValue(eq)}
            className="rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-left font-serif text-sm italic hover:border-app-accent hover:bg-app-ribbon-hover"
          >
            {eq}
          </button>
        ))}
      </div>
    </Modal>
  );
}
