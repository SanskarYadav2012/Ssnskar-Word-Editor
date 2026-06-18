import { ListTree, StickyNote, Quote, BookMarked, Captions } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { useUI } from '@/context/UIContext';
import { RibbonButton } from '@/components/common/RibbonButton';
import { RibbonGroup, RibbonDivider, HStack } from '@/components/common/RibbonGroup';

let footnoteCounter = 0;

export function ReferencesTab() {
  const editor = useEditor();
  const { showToast } = useUI();

  const insertTOC = () => {
    const root = editor.getEditor();
    if (!root) return;
    const headings = root.querySelectorAll('h1,h2,h3');
    if (headings.length === 0) {
      showToast('No headings found to build a table of contents');
      return;
    }
    const items = [...headings]
      .map((h) => {
        const level = Number(h.tagName.substring(1));
        const indent = (level - 1) * 16;
        return `<div style="margin-left:${indent}px;">${h.textContent ?? ''}</div>`;
      })
      .join('');
    editor.insertHTML(
      `<div class="sanskar-toc" style="border:1px solid #d9dee8;border-radius:8px;padding:12px 16px;margin:8px 0;"><strong>Table of Contents</strong>${items}</div><p><br></p>`,
    );
    showToast('Table of contents inserted');
  };

  const insertFootnote = () => {
    footnoteCounter += 1;
    editor.insertHTML(
      `<sup class="footnote-ref" style="color:#1d56d6;">[${footnoteCounter}]</sup>`,
    );
    showToast(`Footnote [${footnoteCounter}] inserted`);
  };

  const insertCitation = () => {
    editor.insertHTML(
      '<span class="citation" style="color:#6b7280;">(Author, 2026)</span>&nbsp;',
    );
  };

  const insertCaption = () => {
    editor.insertHTML(
      '<p class="caption" style="font-size:9pt;font-style:italic;color:#6b7280;text-align:center;">Figure 1: Caption</p>',
    );
  };

  const insertBookmark = () => {
    editor.insertHTML('<a id="bookmark" class="bookmark"></a>');
    showToast('Bookmark inserted');
  };

  return (
    <>
      <RibbonGroup label="Table of Contents">
        <RibbonButton big icon={<ListTree size={18} />} label="TOC" tooltip="Generate table of contents from headings" onClick={insertTOC} />
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Footnotes">
        <RibbonButton big icon={<StickyNote size={18} />} label="Footnote" tooltip="Insert footnote marker" onClick={insertFootnote} />
      </RibbonGroup>

      <RibbonDivider />

      <RibbonGroup label="Citations">
        <HStack>
          <RibbonButton icon={<Quote size={16} />} label="Citation" tooltip="Insert citation" onClick={insertCitation} />
          <RibbonButton icon={<Captions size={16} />} label="Caption" tooltip="Insert caption" onClick={insertCaption} />
          <RibbonButton icon={<BookMarked size={16} />} label="Bookmark" tooltip="Insert bookmark" onClick={insertBookmark} />
        </HStack>
      </RibbonGroup>
    </>
  );
}
