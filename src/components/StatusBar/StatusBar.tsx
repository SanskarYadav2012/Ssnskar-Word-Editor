import { FileText, Hash, Cpu, Save, CheckCircle2 } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { useDev } from '@/context/DevContext';
import { APP_VERSION, COPYRIGHT } from '@/utils/constants';

export function StatusBar() {
  const editor = useEditor();
  const { settings, setZoom } = useSettings();
  const { registerVersionClick, devUnlocked } = useDev();
  const s = editor.stats;

  return (
    <footer className="z-20 flex shrink-0 items-center gap-3 border-t border-app-border bg-app-ribbon px-3 py-1 text-xs text-app-text">
      <span className="flex items-center gap-1" title="Page count">
        <FileText size={13} className="text-app-muted" /> Page 1 of {s.pages}
      </span>
      <span className="flex items-center gap-1" title="Word count">
        <Hash size={13} className="text-app-muted" /> {s.words} words
      </span>
      <span className="hidden items-center gap-1 sm:flex" title="Character count">
        {s.characters} characters
      </span>
      <span className="hidden items-center gap-1 md:flex" title="Analysis engine">
        <Cpu size={13} className="text-app-muted" /> {editor.engine === 'wasm' ? 'Rust/WASM' : 'JS'}
      </span>

      <span className="flex items-center gap-1" title="Save status">
        {editor.dirty ? (
          <>
            <Save size={13} className="text-app-muted" /> Unsaved
          </>
        ) : (
          <>
            <CheckCircle2 size={13} className="text-green-500" /> Saved
          </>
        )}
      </span>

      <div className="flex-1" />

      {/* Zoom slider */}
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-app-muted">{settings.zoom}%</span>
        <input
          type="range"
          min={25}
          max={300}
          step={5}
          value={settings.zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Zoom"
          className="h-1 w-28 cursor-pointer accent-[var(--app-accent)]"
        />
      </div>

      <button
        onClick={registerVersionClick}
        title={devUnlocked ? 'Developer mode unlocked' : 'Tip: click 7 times to unlock Developer Options'}
        className={`rounded px-1.5 py-0.5 transition-colors hover:bg-app-ribbon-hover ${
          devUnlocked ? 'text-app-accent-strong' : 'text-app-muted'
        }`}
      >
        v{APP_VERSION}
      </button>

      <span className="hidden text-right text-app-muted lg:inline">{COPYRIGHT}</span>
    </footer>
  );
}
