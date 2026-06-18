import { useCallback, useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { saveString, loadString } from '@/utils/storage';

const CONTENT_KEY = 'sanskar.document.html';
const STARTER_HTML = `
<h1>Welcome to Sanskar-Word-Editor</h1>
<p>This is a premium, cross-platform word processor. Start typing, or use the ribbon above to format your text.</p>
<p>Try <b>bold</b>, <i>italic</i>, <u>underline</u>, <span style="color:#1d56d6;">colors</span>, lists, tables, images and more.</p>
<ul><li>Open and save <b>.sanskar</b>, .docx, .txt, .rtf, .html and export to PDF</li><li>Switch themes including the premium <span class="gold-text">Gold</span> theme</li><li>Find &amp; replace, word count, auto-save and developer tools</li></ul>
<p><br></p>
`;

export function EditorSurface() {
  const editor = useEditor();
  const { settings } = useSettings();
  const ref = useRef<HTMLDivElement | null>(null);
  const restoredRef = useRef(false);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      ref.current = el;
      editor.registerEditor(el);
    },
    [editor],
  );

  // Restore last document once on mount.
  useEffect(() => {
    if (restoredRef.current || !ref.current) return;
    restoredRef.current = true;
    const saved = loadString(CONTENT_KEY);
    ref.current.innerHTML = saved && saved.trim() ? saved : STARTER_HTML;
    editor.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist content to localStorage as a lightweight crash-recovery buffer.
  const handleInput = useCallback(() => {
    editor.notifyChange();
    if (ref.current) saveString(CONTENT_KEY, ref.current.innerHTML);
  }, [editor]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      // Allow rich paste but strip dangerous tags by routing HTML through a sanitiser.
      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');
      if (html) {
        e.preventDefault();
        const clean = sanitizePastedHtml(html);
        document.execCommand('insertHTML', false, clean);
        handleInput();
      } else if (text) {
        e.preventDefault();
        document.execCommand('insertText', false, text);
        handleInput();
      }
    },
    [handleInput],
  );

  return (
    <div
      ref={setRef}
      className="editor-content min-h-full"
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Document editor"
      spellCheck={settings.spellCheckEnabled}
      data-spellcheck={settings.spellCheckEnabled}
      data-placeholder="Start writing your masterpiece…"
      onInput={handleInput}
      onBlur={() => editor.saveSelection()}
      onMouseUp={() => editor.refresh()}
      onKeyUp={() => editor.refresh()}
      onPaste={handlePaste}
      style={{
        ['--editor-font' as string]: settings.defaultFontFamily,
        ['--editor-size' as string]: `${settings.defaultFontSize}pt`,
      }}
    />
  );
}

function sanitizePastedHtml(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script,style,meta,link,iframe,object,embed').forEach((n) => n.remove());
  template.content.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      if (name === 'href' && /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
    });
  });
  return template.innerHTML;
}
