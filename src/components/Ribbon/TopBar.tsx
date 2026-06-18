import {
  FileText,
  FolderOpen,
  Save,
  Download,
  Printer,
  Undo2,
  Redo2,
  Settings,
  Info,
  Plus,
  PanelRightOpen,
  Sparkles,
} from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';
import { useSettings } from '@/context/SettingsContext';
import { useFileActions } from '@/hooks/useFileActions';
import { Popover } from '@/components/common/Popover';
import { APP_NAME } from '@/utils/constants';
import type { SupportedExtension, ThemeName } from '@/types';
import logoUrl from '/logo.png';

const EXPORTS: { ext: SupportedExtension; label: string }[] = [
  { ext: 'sanskar', label: 'Sanskar Document (.sanskar)' },
  { ext: 'docx', label: 'Word Document (.docx)' },
  { ext: 'pdf', label: 'PDF Document (.pdf)' },
  { ext: 'txt', label: 'Plain Text (.txt)' },
  { ext: 'rtf', label: 'Rich Text (.rtf)' },
  { ext: 'html', label: 'Web Page (.html)' },
];

const THEME_CYCLE: ThemeName[] = ['light', 'dark', 'gold', 'system'];

function MenuItem({
  icon,
  label,
  onClick,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-app-text transition-colors hover:bg-app-ribbon-hover"
    >
      <span className="text-app-muted">{icon}</span>
      <span className="flex-1">{label}</span>
      {hint && <span className="text-xs text-app-muted">{hint}</span>}
    </button>
  );
}

export function TopBar() {
  const editor = useEditor();
  const { settings, setTheme } = useSettings();
  const { openModal, toggleSidebar } = useUI();
  const { newDocument, open, saveDefault, exportAs, print } = useFileActions();

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(settings.theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  return (
    <div className="flex items-center gap-2 border-b border-app-border bg-app-ribbon px-3 py-1.5">
      <img src={logoUrl} alt={`${APP_NAME} logo`} className="h-7 w-7 rounded-md shadow-sm" />
      <span className="hidden select-none text-sm font-semibold gold-text sm:inline">{APP_NAME}</span>

      <Popover
        align="left"
        width={250}
        showChevron={false}
        trigger={<span className="px-1 text-sm font-medium">File</span>}
        ariaLabel="File menu"
      >
        {(close) => (
          <div className="flex flex-col">
            <MenuItem icon={<Plus size={16} />} label="New" onClick={() => { newDocument(); close(); }} />
            <MenuItem icon={<FolderOpen size={16} />} label="Open…" hint="Ctrl+O" onClick={() => { open(); close(); }} />
            <MenuItem icon={<Save size={16} />} label="Save (.sanskar)" hint="Ctrl+S" onClick={() => { saveDefault(); close(); }} />
            <div className="my-1 border-t border-app-border" />
            <div className="px-2 py-1 text-xs font-semibold uppercase text-app-muted">Export as</div>
            {EXPORTS.map((item) => (
              <MenuItem
                key={item.ext}
                icon={<Download size={16} />}
                label={item.label}
                onClick={() => { exportAs(item.ext); close(); }}
              />
            ))}
            <div className="my-1 border-t border-app-border" />
            <MenuItem icon={<Printer size={16} />} label="Print" hint="Ctrl+P" onClick={() => { print(); close(); }} />
            <MenuItem icon={<Info size={16} />} label="About" onClick={() => { openModal('about'); close(); }} />
          </div>
        )}
      </Popover>

      {/* Document title */}
      <input
        value={editor.title}
        onChange={(e) => editor.setTitle(e.target.value)}
        spellCheck={false}
        aria-label="Document title"
        className="ml-1 min-w-0 flex-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-app-text outline-none hover:bg-app-surface-2 focus:bg-app-surface-2"
      />
      {editor.dirty && (
        <span className="hidden text-xs text-app-muted md:inline" title="Unsaved changes">
          ● Unsaved
        </span>
      )}

      {/* Quick actions */}
      <div className="flex items-center gap-0.5">
        <button title="Undo (Ctrl+Z)" aria-label="Undo" className="ribbon-btn h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={editor.undo}>
          <Undo2 size={16} />
        </button>
        <button title="Redo (Ctrl+Y)" aria-label="Redo" className="ribbon-btn h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={editor.redo}>
          <Redo2 size={16} />
        </button>
        <button title="Save" aria-label="Save" className="ribbon-btn h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={saveDefault}>
          <FileText size={16} />
        </button>
        <button title={`Theme: ${settings.theme}`} aria-label="Cycle theme" className="ribbon-btn h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={cycleTheme}>
          <Sparkles size={16} />
        </button>
        <button title="Toggle contact sidebar" aria-label="Toggle sidebar" className="ribbon-btn h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={toggleSidebar}>
          <PanelRightOpen size={16} />
        </button>
        <button title="Settings" aria-label="Settings" className="ribbon-btn h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={() => openModal('settings')}>
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
