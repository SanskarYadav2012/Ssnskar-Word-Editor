import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Baseline,
  Highlighter,
  RemoveFormatting,
  Type,
  ChevronDown,
  Search,
  Clipboard,
  Scissors,
  Copy,
} from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';
import { RibbonButton } from '@/components/common/RibbonButton';
import { RibbonGroup, RibbonDivider, HStack, VStack } from '@/components/common/RibbonGroup';
import { Popover } from '@/components/common/Popover';
import { ColorGrid } from '@/components/common/ColorGrid';
import {
  FONT_FAMILIES,
  FONT_SIZES,
  LINE_SPACINGS,
  TEXT_COLORS,
  HIGHLIGHT_COLORS,
} from '@/utils/constants';

const BLOCK_STYLES: { tag: string; label: string }[] = [
  { tag: 'p', label: 'Normal' },
  { tag: 'h1', label: 'Heading 1' },
  { tag: 'h2', label: 'Heading 2' },
  { tag: 'h3', label: 'Heading 3' },
  { tag: 'blockquote', label: 'Quote' },
  { tag: 'pre', label: 'Code' },
];

export function HomeTab() {
  const editor = useEditor();
  const { openModal } = useUI();
  const f = editor.formatState;

  return (
    <>
      <RibbonGroup label="Clipboard">
        <VStack>
          <RibbonButton icon={<Clipboard size={16} />} label="Paste" tooltip="Paste (Ctrl+V)" onClick={() => editor.runInline('paste')} />
          <HStack>
            <RibbonButton icon={<Scissors size={14} />} tooltip="Cut (Ctrl+X)" onClick={() => editor.runInline('cut')} />
            <RibbonButton icon={<Copy size={14} />} tooltip="Copy (Ctrl+C)" onClick={() => editor.runInline('copy')} />
          </HStack>
        </VStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Font">
        <VStack>
          <HStack>
            <Popover
              width={210}
              ariaLabel="Font family"
              onOpen={editor.saveSelection}
              trigger={<span className="w-28 truncate text-left">{f.fontName || 'Calibri'}</span>}
            >
              {(close) => (
                <div className="thin-scroll max-h-64 overflow-y-auto">
                  {FONT_FAMILIES.map((font) => (
                    <button
                      key={font}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { editor.setFontFamily(font); close(); }}
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-app-ribbon-hover"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              )}
            </Popover>
            <Popover
              width={96}
              ariaLabel="Font size"
              onOpen={editor.saveSelection}
              trigger={<span className="w-8 text-center">{f.fontSize || '11'}</span>}
            >
              {(close) => (
                <div className="thin-scroll max-h-64 overflow-y-auto">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { editor.setFontSize(size); close(); }}
                      className="block w-full rounded px-2 py-1 text-center text-sm hover:bg-app-ribbon-hover"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </Popover>
          </HStack>
          <HStack>
            <RibbonButton icon={<Bold size={16} />} tooltip="Bold (Ctrl+B)" active={f.bold} onClick={() => editor.runInline('bold')} />
            <RibbonButton icon={<Italic size={16} />} tooltip="Italic (Ctrl+I)" active={f.italic} onClick={() => editor.runInline('italic')} />
            <RibbonButton icon={<Underline size={16} />} tooltip="Underline (Ctrl+U)" active={f.underline} onClick={() => editor.runInline('underline')} />
            <RibbonButton icon={<Strikethrough size={16} />} tooltip="Strikethrough" active={f.strikeThrough} onClick={() => editor.runInline('strikeThrough')} />
            <RibbonButton icon={<Subscript size={16} />} tooltip="Subscript" active={f.subscript} onClick={() => editor.runInline('subscript')} />
            <RibbonButton icon={<Superscript size={16} />} tooltip="Superscript" active={f.superscript} onClick={() => editor.runInline('superscript')} />
            <Popover
              ariaLabel="Text color"
              showChevron
              onOpen={editor.saveSelection}
              trigger={<Baseline size={16} style={{ color: f.foreColor || undefined }} />}
              title="Text color"
            >
              {(close) => <ColorGrid colors={TEXT_COLORS} onPick={(c) => { editor.setForeColor(c); close(); }} />}
            </Popover>
            <Popover
              ariaLabel="Highlight color"
              showChevron
              onOpen={editor.saveSelection}
              trigger={<Highlighter size={16} />}
              title="Highlight"
            >
              {(close) => <ColorGrid colors={HIGHLIGHT_COLORS} onPick={(c) => { editor.setHighlight(c); close(); }} allowCustom={false} />}
            </Popover>
            <RibbonButton icon={<RemoveFormatting size={16} />} tooltip="Clear formatting" onClick={editor.clearFormatting} />
          </HStack>
        </VStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Paragraph">
        <VStack>
          <HStack>
            <RibbonButton icon={<AlignLeft size={16} />} tooltip="Align left" active={f.alignLeft} onClick={() => editor.setAlignment('Left')} />
            <RibbonButton icon={<AlignCenter size={16} />} tooltip="Align center" active={f.alignCenter} onClick={() => editor.setAlignment('Center')} />
            <RibbonButton icon={<AlignRight size={16} />} tooltip="Align right" active={f.alignRight} onClick={() => editor.setAlignment('Right')} />
            <RibbonButton icon={<AlignJustify size={16} />} tooltip="Justify" active={f.alignJustify} onClick={() => editor.setAlignment('Full')} />
            <Popover
              ariaLabel="Line spacing"
              onOpen={editor.saveSelection}
              trigger={<Type size={16} />}
              title="Line spacing"
              width={120}
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
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </Popover>
          </HStack>
          <HStack>
            <RibbonButton icon={<List size={16} />} tooltip="Bulleted list" active={f.unorderedList} onClick={() => editor.toggleList('unordered')} />
            <RibbonButton icon={<ListOrdered size={16} />} tooltip="Numbered list" active={f.orderedList} onClick={() => editor.toggleList('ordered')} />
            <RibbonButton icon={<Outdent size={16} />} tooltip="Decrease indent" onClick={editor.outdent} />
            <RibbonButton icon={<Indent size={16} />} tooltip="Increase indent" onClick={editor.indent} />
          </HStack>
        </VStack>
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Styles">
        <Popover
          width={170}
          ariaLabel="Paragraph style"
          onOpen={editor.saveSelection}
          trigger={
            <span className="flex w-28 items-center justify-between">
              {BLOCK_STYLES.find((b) => b.tag === f.blockFormat)?.label ?? 'Normal'}
              <ChevronDown size={14} />
            </span>
          }
          showChevron={false}
        >
          {(close) => (
            <div>
              {BLOCK_STYLES.map((style) => (
                <button
                  key={style.tag}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { editor.setBlockFormat(style.tag); close(); }}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-app-ribbon-hover"
                >
                  {style.label}
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
