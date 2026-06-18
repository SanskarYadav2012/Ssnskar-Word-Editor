import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';
import {
  clearHighlights,
  focusMatch,
  highlightMatches,
  replaceAllMatches,
  replaceMatch,
  type FindOptions,
} from '@/core/findReplace';

export function FindReplace() {
  const editor = useEditor();
  const { modal, closeModal, showToast } = useUI();
  const open = modal === 'find';

  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [options, setOptions] = useState<FindOptions>({ matchCase: false, wholeWord: false });
  const [matches, setMatches] = useState<HTMLElement[]>([]);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = useCallback(() => {
    const root = editor.getEditor();
    if (!root) return;
    const found = highlightMatches(root, query, options);
    setMatches(found);
    setIndex(0);
    if (found.length > 0) focusMatch(found, 0);
  }, [editor, query, options]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      const root = editor.getEditor();
      if (root) clearHighlights(root);
      setMatches([]);
    }
  }, [open, editor]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(runSearch, 220);
    return () => window.clearTimeout(id);
  }, [open, query, options, runSearch]);

  const navigate = (dir: 1 | -1) => {
    if (matches.length === 0) return;
    const next = (index + dir + matches.length) % matches.length;
    setIndex(next);
    focusMatch(matches, next);
  };

  const handleReplace = () => {
    const root = editor.getEditor();
    if (!root || matches.length === 0) return;
    replaceMatch(root, matches, index, replacement);
    editor.notifyChange();
    setTimeout(runSearch, 0);
  };

  const handleReplaceAll = () => {
    if (matches.length === 0) return;
    const count = replaceAllMatches(matches, replacement);
    editor.notifyChange();
    setMatches([]);
    showToast(`Replaced ${count} occurrence${count === 1 ? '' : 's'}`);
  };

  return (
    <Modal open={open} onClose={closeModal} title="Find & Replace" icon={<Search size={18} />} width={460}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(e.shiftKey ? -1 : 1)}
            placeholder="Find"
            className="flex-1 rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-sm outline-none focus:border-app-accent"
          />
          <span className="w-16 text-center text-xs tabular-nums text-app-muted">
            {matches.length ? `${index + 1}/${matches.length}` : '0/0'}
          </span>
          <button onClick={() => navigate(-1)} className="ribbon-btn h-8 w-8" title="Previous">
            <ChevronUp size={16} />
          </button>
          <button onClick={() => navigate(1)} className="ribbon-btn h-8 w-8" title="Next">
            <ChevronDown size={16} />
          </button>
        </div>

        <input
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder="Replace with"
          className="w-full rounded-md border border-app-border bg-app-surface-2 px-3 py-2 text-sm outline-none focus:border-app-accent"
        />

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.matchCase}
              onChange={(e) => setOptions((o) => ({ ...o, matchCase: e.target.checked }))}
            />
            Match case
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.wholeWord}
              onChange={(e) => setOptions((o) => ({ ...o, wholeWord: e.target.checked }))}
            />
            Whole word
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={handleReplace}
            disabled={matches.length === 0}
            className="rounded-md border border-app-border px-3 py-1.5 text-sm hover:bg-app-surface-2 disabled:opacity-40"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={matches.length === 0}
            className="rounded-md bg-app-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-app-accent-strong disabled:opacity-40"
          >
            Replace all
          </button>
        </div>
      </div>
    </Modal>
  );
}
