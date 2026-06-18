import { useRef, useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';

export function InsertImage() {
  const editor = useEditor();
  const { modal, closeModal, showToast } = useUI();
  const open = modal === 'image';
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const insertFromUrl = () => {
    if (!url.trim()) return;
    editor.insertImage(url.trim());
    setUrl('');
    closeModal();
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      editor.insertImage(String(reader.result), file.name);
      closeModal();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal open={open} onClose={closeModal} title="Insert Image" icon={<ImageIcon size={18} />} width={440}>
      <div className="space-y-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-app-border py-8 text-app-muted transition-colors hover:border-app-accent hover:text-app-accent"
        >
          <Upload size={28} />
          <span className="text-sm">Upload from your device</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-app-border" />
          <span className="text-xs text-app-muted">or paste a URL</span>
          <div className="h-px flex-1 bg-app-border" />
        </div>

        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && insertFromUrl()}
            placeholder="https://example.com/image.png"
            className="flex-1 rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-sm outline-none focus:border-app-accent"
          />
          <button
            onClick={insertFromUrl}
            className="rounded-md bg-app-accent px-3 py-2 text-sm font-medium text-white hover:bg-app-accent-strong"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}
