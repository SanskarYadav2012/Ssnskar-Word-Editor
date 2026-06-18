import { useState } from 'react';
import { Table } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';

const MAX = 10;

export function InsertTable() {
  const editor = useEditor();
  const { modal, closeModal } = useUI();
  const open = modal === 'table';
  const [hover, setHover] = useState({ rows: 3, cols: 3 });
  const [withHeader, setWithHeader] = useState(true);

  const insert = (rows: number, cols: number) => {
    editor.insertTable(rows, cols, withHeader);
    closeModal();
  };

  return (
    <Modal open={open} onClose={closeModal} title="Insert Table" icon={<Table size={18} />} width={360}>
      <p className="mb-3 text-sm text-app-muted">
        {hover.rows} × {hover.cols} table
      </p>
      <div
        className="inline-grid gap-1"
        style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}
        onMouseLeave={() => setHover({ rows: 3, cols: 3 })}
      >
        {Array.from({ length: MAX * MAX }, (_, i) => {
          const r = Math.floor(i / MAX) + 1;
          const c = (i % MAX) + 1;
          const active = r <= hover.rows && c <= hover.cols;
          return (
            <button
              key={i}
              onMouseEnter={() => setHover({ rows: r, cols: c })}
              onClick={() => insert(r, c)}
              className={`h-5 w-5 rounded-sm border ${
                active ? 'border-app-accent bg-app-accent/30' : 'border-app-border bg-app-surface-2'
              }`}
            />
          );
        })}
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={withHeader} onChange={(e) => setWithHeader(e.target.checked)} />
        Include header row
      </label>
      <button
        onClick={() => insert(hover.rows, hover.cols)}
        className="mt-4 w-full rounded-md bg-app-accent px-3 py-2 text-sm font-medium text-white hover:bg-app-accent-strong"
      >
        Insert {hover.rows} × {hover.cols} table
      </button>
    </Modal>
  );
}
