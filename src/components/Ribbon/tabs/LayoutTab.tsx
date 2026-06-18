import { FileText, Scaling, Indent, Outdent, StretchVertical } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useEditor } from '@/context/EditorContext';
import { RibbonButton } from '@/components/common/RibbonButton';
import { RibbonGroup, RibbonDivider, HStack } from '@/components/common/RibbonGroup';
import { Popover } from '@/components/common/Popover';
import type { PageMargins, PageSizeName } from '@/types';
import { LINE_SPACINGS } from '@/utils/constants';

const PAGE_SIZES: PageSizeName[] = ['A4', 'Letter', 'Legal'];

const MARGIN_PRESETS: { label: string; value: PageMargins }[] = [
  { label: 'Normal', value: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 } },
  { label: 'Narrow', value: { top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 } },
  { label: 'Moderate', value: { top: 25.4, right: 19, bottom: 25.4, left: 19 } },
  { label: 'Wide', value: { top: 25.4, right: 50.8, bottom: 25.4, left: 50.8 } },
];

export function LayoutTab() {
  const { settings, update } = useSettings();
  const editor = useEditor();

  return (
    <>
      <RibbonGroup label="Page Size">
        <Popover
          ariaLabel="Page size"
          width={130}
          trigger={<span className="flex items-center gap-1"><FileText size={16} />{settings.pageSize}</span>}
          showChevron
        >
          {(close) => (
            <div>
              {PAGE_SIZES.map((size) => (
                <button
                  key={size}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { update({ pageSize: size }); close(); }}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-app-ribbon-hover"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </Popover>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Margins">
        <Popover
          ariaLabel="Margins"
          width={150}
          trigger={<span className="flex items-center gap-1"><Scaling size={16} />Margins</span>}
          showChevron
        >
          {(close) => (
            <div>
              {MARGIN_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { update({ margins: preset.value }); close(); }}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-app-ribbon-hover"
                >
                  {preset.label}
                  <span className="ml-1 text-xs text-app-muted">
                    {preset.value.top}mm
                  </span>
                </button>
              ))}
            </div>
          )}
        </Popover>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Indent">
        <HStack>
          <RibbonButton icon={<Outdent size={16} />} label="Left" tooltip="Decrease indent" onClick={editor.outdent} />
          <RibbonButton icon={<Indent size={16} />} label="Right" tooltip="Increase indent" onClick={editor.indent} />
        </HStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Spacing">
        <Popover
          ariaLabel="Paragraph spacing"
          width={120}
          trigger={<span className="flex items-center gap-1"><StretchVertical size={16} />Spacing</span>}
          showChevron
          onOpen={editor.saveSelection}
        >
          {(close) => (
            <div>
              {LINE_SPACINGS.map((s) => (
                <button
                  key={s.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { editor.setLineSpacing(s.value); close(); }}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-app-ribbon-hover"
                >
                  Line {s.label}
                </button>
              ))}
            </div>
          )}
        </Popover>
      </RibbonGroup>
    </>
  );
}
