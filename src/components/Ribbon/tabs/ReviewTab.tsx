import { SpellCheck, Languages, BarChart3, Search, BookOpenCheck } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { useUI } from '@/context/UIContext';
import { useDev } from '@/context/DevContext';
import { RibbonButton } from '@/components/common/RibbonButton';
import { RibbonGroup, RibbonDivider } from '@/components/common/RibbonGroup';
import { Popover } from '@/components/common/Popover';
import { LANGUAGES } from '@/utils/constants';

export function ReviewTab() {
  const editor = useEditor();
  const { settings, update } = useSettings();
  const { openModal, showToast } = useUI();
  const { flags } = useDev();
  const s = editor.stats;

  return (
    <>
      <RibbonGroup label="Proofing">
        <RibbonButton
          big
          icon={<SpellCheck size={18} />}
          label="Spelling"
          tooltip="Toggle spell check"
          active={settings.spellCheckEnabled}
          onClick={() => update({ spellCheckEnabled: !settings.spellCheckEnabled })}
        />
        <RibbonButton
          big
          icon={<BookOpenCheck size={18} />}
          label="Grammar"
          tooltip={flags.experimentalGrammar ? 'Grammar check (experimental)' : 'Enable Grammar in Developer Options'}
          disabled={!flags.experimentalGrammar}
          onClick={() => showToast('Grammar suggestions are experimental and enabled via feature flags')}
        />
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Insights">
        <Popover
          ariaLabel="Word count"
          width={220}
          trigger={<span className="flex flex-col items-center gap-1 text-[11px]"><BarChart3 size={18} />Word Count</span>}
          showChevron={false}
        >
          {() => (
            <div className="space-y-1 text-sm">
              <Stat label="Words" value={s.words} />
              <Stat label="Characters" value={s.characters} />
              <Stat label="Characters (no spaces)" value={s.charactersNoSpaces} />
              <Stat label="Sentences" value={s.sentences} />
              <Stat label="Paragraphs" value={s.paragraphs} />
              <Stat label="Pages" value={s.pages} />
              <Stat label="Reading time" value={`${s.readingTimeMin} min`} />
              <div className="mt-1 border-t border-app-border pt-1 text-xs text-app-muted">
                Engine: {editor.engine === 'wasm' ? 'Rust/WASM' : 'JavaScript'}
              </div>
            </div>
          )}
        </Popover>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Language">
        <Popover
          ariaLabel="Language"
          width={180}
          trigger={<span className="flex items-center gap-1"><Languages size={16} />{settings.language}</span>}
          showChevron
        >
          {(close) => (
            <div className="thin-scroll max-h-56 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { update({ language: lang.code }); close(); }}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-app-ribbon-hover"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </Popover>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Editing">
        <RibbonButton big icon={<Search size={18} />} label="Find" tooltip="Find & Replace (Ctrl+F)" onClick={() => openModal('find')} />
      </RibbonGroup>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-app-muted">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
