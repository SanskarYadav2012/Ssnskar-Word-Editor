import {
  Table,
  Image as ImageIcon,
  Link2,
  Square,
  Circle,
  Triangle,
  Minus,
  Star,
  Heading,
  PanelTop,
  PanelBottom,
  Hash,
  Sigma,
  Code2,
  Omega,
  SplitSquareVertical,
} from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';
import { RibbonButton } from '@/components/common/RibbonButton';
import { RibbonGroup, RibbonDivider, HStack } from '@/components/common/RibbonGroup';
import { Popover } from '@/components/common/Popover';

function focusRunningZone(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

export function InsertTab() {
  const editor = useEditor();
  const { openModal } = useUI();

  return (
    <>
      <RibbonGroup label="Tables">
        <RibbonButton big icon={<Table size={18} />} label="Table" tooltip="Insert table" onClick={() => openModal('table')} />
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Media">
        <RibbonButton big icon={<ImageIcon size={18} />} label="Image" tooltip="Insert image" onClick={() => openModal('image')} />
        <Popover
          ariaLabel="Insert shape"
          trigger={<span className="flex flex-col items-center gap-1 text-[11px]"><Square size={18} />Shape</span>}
          showChevron={false}
          width={160}
          title="Shapes"
        >
          {(close) => (
            <div className="grid grid-cols-3 gap-1">
              <ShapeBtn icon={<Square size={18} />} label="Rect" onClick={() => { editor.insertShape('rectangle'); close(); }} />
              <ShapeBtn icon={<Circle size={18} />} label="Circle" onClick={() => { editor.insertShape('circle'); close(); }} />
              <ShapeBtn icon={<Triangle size={18} />} label="Triangle" onClick={() => { editor.insertShape('triangle'); close(); }} />
              <ShapeBtn icon={<Minus size={18} />} label="Line" onClick={() => { editor.insertShape('line'); close(); }} />
              <ShapeBtn icon={<Star size={18} />} label="Star" onClick={() => { editor.insertShape('star'); close(); }} />
            </div>
          )}
        </Popover>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Links">
        <RibbonButton big icon={<Link2 size={18} />} label="Link" tooltip="Insert hyperlink (Ctrl+K)" onClick={() => { editor.saveSelection(); openModal('link'); }} />
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Header & Footer">
        <HStack>
          <RibbonButton icon={<PanelTop size={16} />} label="Header" tooltip="Edit header" onClick={() => focusRunningZone('sanskar-header')} />
          <RibbonButton icon={<PanelBottom size={16} />} label="Footer" tooltip="Edit footer" onClick={() => focusRunningZone('sanskar-footer')} />
          <RibbonButton icon={<Hash size={16} />} label="Page #" tooltip="Insert page number" onClick={() => { focusRunningZone('sanskar-footer'); editor.insertSpecialChar('Page '); }} />
          <RibbonButton icon={<Heading size={16} />} label="Title" tooltip="Insert document title" onClick={() => editor.setBlockFormat('h1')} />
        </HStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Symbols & Code">
        <HStack>
          <RibbonButton icon={<Sigma size={16} />} label="Equation" tooltip="Insert equation" onClick={() => openModal('equation')} />
          <RibbonButton icon={<Omega size={16} />} label="Symbol" tooltip="Insert symbol" onClick={() => openModal('symbol')} />
          <RibbonButton icon={<Code2 size={16} />} label="Code" tooltip="Insert code block" onClick={editor.insertCodeBlock} />
        </HStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Page">
        <HStack>
          <RibbonButton icon={<SplitSquareVertical size={16} />} label="Break" tooltip="Insert page break" onClick={editor.insertPageBreak} />
          <RibbonButton icon={<Minus size={16} />} label="Rule" tooltip="Insert horizontal line" onClick={editor.insertHorizontalRule} />
        </HStack>
      </RibbonGroup>
    </>
  );
}

function ShapeBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-md px-2 py-2 text-[11px] hover:bg-app-ribbon-hover"
    >
      {icon}
      {label}
    </button>
  );
}
