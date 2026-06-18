import { ZoomIn, ZoomOut, Ruler, Focus, PanelRight, Sun, Moon, Crown, Monitor, Terminal } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useUI } from '@/context/UIContext';
import { useDev } from '@/context/DevContext';
import { RibbonButton } from '@/components/common/RibbonButton';
import { RibbonGroup, RibbonDivider, HStack } from '@/components/common/RibbonGroup';
import type { ThemeName } from '@/types';

const THEMES: { id: ThemeName; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun size={16} /> },
  { id: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  { id: 'gold', label: 'Gold', icon: <Crown size={16} /> },
  { id: 'system', label: 'System', icon: <Monitor size={16} /> },
];

export function ViewTab() {
  const { settings, update, setZoom, setTheme } = useSettings();
  const { toggleSidebar, openModal } = useUI();
  const { devUnlocked, flags, setFlag } = useDev();

  return (
    <>
      <RibbonGroup label="Zoom">
        <HStack>
          <RibbonButton icon={<ZoomOut size={16} />} tooltip="Zoom out" onClick={() => setZoom(settings.zoom - 10)} />
          <span className="w-12 text-center text-sm tabular-nums">{settings.zoom}%</span>
          <RibbonButton icon={<ZoomIn size={16} />} tooltip="Zoom in" onClick={() => setZoom(settings.zoom + 10)} />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setZoom(100)}
            className="ribbon-btn h-8 px-2 text-xs"
          >
            Reset
          </button>
        </HStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Show">
        <HStack>
          <RibbonButton icon={<Ruler size={16} />} label="Ruler" tooltip="Toggle ruler" active={settings.showRuler} onClick={() => update({ showRuler: !settings.showRuler })} />
          <RibbonButton icon={<Focus size={16} />} label="Focus" tooltip="Focus mode" active={flags.focusMode} onClick={() => setFlag('focusMode', !flags.focusMode)} />
          <RibbonButton icon={<PanelRight size={16} />} label="Contacts" tooltip="Toggle contact sidebar" onClick={toggleSidebar} />
        </HStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Theme">
        <HStack>
          {THEMES.map((theme) => (
            <RibbonButton
              key={theme.id}
              icon={theme.icon}
              label={theme.label}
              tooltip={`${theme.label} theme`}
              active={settings.theme === theme.id}
              onClick={() => setTheme(theme.id)}
            />
          ))}
        </HStack>
      </RibbonGroup>

      {devUnlocked && (
        <>
          <RibbonDivider />
          <RibbonGroup label="Developer">
            <RibbonButton big icon={<Terminal size={18} />} label="Dev Tools" tooltip="Open developer options" onClick={() => openModal('dev')} />
          </RibbonGroup>
        </>
      )}
    </>
  );
}
