import { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';

export function InsertLink() {
  const editor = useEditor();
  const { modal, closeModal } = useUI();
  const open = modal === 'link';
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      const sel = window.getSelection()?.toString() ?? '';
      setText(sel);
      setUrl('https://');
    }
  }, [open]);

  const submit = () => {
    if (!url.trim()) return;
    editor.insertLink(url.trim(), text.trim());
    closeModal();
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Insert Hyperlink"
      icon={<Link2 size={18} />}
      width={440}
      footer={
        <>
          <button onClick={closeModal} className="rounded-md border border-app-border px-3 py-1.5 text-sm hover:bg-app-surface-2">
            Cancel
          </button>
          <button onClick={submit} className="rounded-md bg-app-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-app-accent-strong">
            Insert
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-app-muted">Text to display</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Link text (optional)"
            className="w-full rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-sm outline-none focus:border-app-accent"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-app-muted">Address</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="https://example.com"
            className="w-full rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-sm outline-none focus:border-app-accent"
          />
        </label>
      </div>
    </Modal>
  );
}
