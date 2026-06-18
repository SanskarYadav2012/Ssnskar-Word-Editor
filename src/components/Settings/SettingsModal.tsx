import { Settings as SettingsIcon, Sun, Moon, Crown, Monitor, Keyboard, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useSettings } from '@/context/SettingsContext';
import { useUI } from '@/context/UIContext';
import { FONT_FAMILIES, FONT_SIZES, LANGUAGES } from '@/utils/constants';
import type { ThemeName } from '@/types';

const THEMES: { id: ThemeName; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun size={18} /> },
  { id: 'dark', label: 'Dark', icon: <Moon size={18} /> },
  { id: 'system', label: 'System', icon: <Monitor size={18} /> },
  { id: 'gold', label: 'Premium Gold', icon: <Crown size={18} /> },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-app-muted">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-app-text">{label}</span>
      {children}
    </div>
  );
}

const selectClass =
  'rounded-md border border-app-border bg-app-surface-2 px-2 py-1 text-sm outline-none focus:border-app-accent';

export function SettingsModal() {
  const { settings, update, setTheme, reset } = useSettings();
  const { modal, closeModal, openModal } = useUI();
  const open = modal === 'settings';

  return (
    <Modal open={open} onClose={closeModal} title="Settings" icon={<SettingsIcon size={18} />} width={560}>
      <Section title="Appearance">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs transition-all ${
                settings.theme === theme.id
                  ? 'border-app-accent bg-app-ribbon-hover text-app-accent-strong'
                  : 'border-app-border hover:bg-app-surface-2'
              } ${theme.id === 'gold' ? 'data-[active=true]:shadow-gold' : ''}`}
              data-active={settings.theme === theme.id}
            >
              {theme.icon}
              {theme.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Default Font">
        <Row label="Font family">
          <select
            value={settings.defaultFontFamily}
            onChange={(e) => update({ defaultFontFamily: e.target.value })}
            className={selectClass}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </Row>
        <Row label="Font size">
          <select
            value={settings.defaultFontSize}
            onChange={(e) => update({ defaultFontSize: Number(e.target.value) })}
            className={selectClass}
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Row>
      </Section>

      <Section title="Auto-save">
        <Row label="Enable auto-save">
          <input
            type="checkbox"
            checked={settings.autoSaveEnabled}
            onChange={(e) => update({ autoSaveEnabled: e.target.checked })}
            className="h-4 w-4 accent-[var(--app-accent)]"
          />
        </Row>
        <Row label={`Interval: ${settings.autoSaveIntervalSec}s`}>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={settings.autoSaveIntervalSec}
            disabled={!settings.autoSaveEnabled}
            onChange={(e) => update({ autoSaveIntervalSec: Number(e.target.value) })}
            className="w-40 accent-[var(--app-accent)]"
          />
        </Row>
      </Section>

      <Section title="Editing">
        <Row label="Spell check">
          <input
            type="checkbox"
            checked={settings.spellCheckEnabled}
            onChange={(e) => update({ spellCheckEnabled: e.target.checked })}
            className="h-4 w-4 accent-[var(--app-accent)]"
          />
        </Row>
        <Row label="Show ruler / page guides">
          <input
            type="checkbox"
            checked={settings.showRuler}
            onChange={(e) => update({ showRuler: e.target.checked })}
            className="h-4 w-4 accent-[var(--app-accent)]"
          />
        </Row>
        <Row label="Language">
          <select
            value={settings.language}
            onChange={(e) => update({ language: e.target.value })}
            className={selectClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </Row>
      </Section>

      <div className="flex items-center justify-between border-t border-app-border pt-4">
        <button
          onClick={() => openModal('shortcuts')}
          className="flex items-center gap-2 rounded-md border border-app-border px-3 py-1.5 text-sm hover:bg-app-surface-2"
        >
          <Keyboard size={15} /> Keyboard shortcuts
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md border border-app-border px-3 py-1.5 text-sm text-red-500 hover:bg-app-surface-2"
        >
          <RotateCcw size={15} /> Reset to defaults
        </button>
      </div>
    </Modal>
  );
}
