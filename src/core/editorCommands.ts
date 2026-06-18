import type { SelectionFormatState } from '@/types';

/**
 * Low-level editor command layer.
 *
 * The editor surface is a single `contentEditable` region. Formatting is
 * applied through the browser's rich-text editing engine (`execCommand`).
 * `execCommand` is formally deprecated but remains fully supported in every
 * Chromium runtime we ship on (Chrome, Electron, Android WebView), and is the
 * most robust way to perform selection-aware formatting without re-implementing
 * a DOM range engine. Helpers below paper over the few rough edges
 * (arbitrary font sizes, line spacing, inline CSS).
 */

let cssModeInitialised = false;

function ensureCssMode(): void {
  if (cssModeInitialised) return;
  try {
    document.execCommand('styleWithCSS', false, 'true');
    cssModeInitialised = true;
  } catch {
    /* styleWithCSS unsupported — fall back to default markup */
  }
}

export function execFormat(command: string, value?: string): void {
  ensureCssMode();
  try {
    document.execCommand(command, false, value);
  } catch {
    /* ignore unsupported command */
  }
}

export function getActiveEditorElement(): HTMLElement | null {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active.isContentEditable) return active;
  return null;
}

function getSelection(): Selection | null {
  return window.getSelection();
}

/** The block-level element that currently contains the caret. */
export function getSelectedBlocks(root: HTMLElement): HTMLElement[] {
  const sel = getSelection();
  if (!sel || sel.rangeCount === 0) return [];
  const range = sel.getRangeAt(0);
  const blocks = new Set<HTMLElement>();

  const resolveBlock = (node: Node | null): HTMLElement | null => {
    let current: Node | null = node;
    while (current && current !== root) {
      if (current instanceof HTMLElement) {
        const display = window.getComputedStyle(current).display;
        if (display.startsWith('block') || display === 'list-item' || current.tagName === 'LI') {
          return current;
        }
      }
      current = current.parentNode;
    }
    return root;
  };

  const start = resolveBlock(range.startContainer);
  const end = resolveBlock(range.endContainer);
  if (start) blocks.add(start);
  if (end) blocks.add(end);

  // Include any block elements fully spanned by the selection.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) =>
      range.intersectsNode(node) && node instanceof HTMLElement
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });
  let n = walker.nextNode();
  while (n) {
    if (n instanceof HTMLElement) {
      const display = window.getComputedStyle(n).display;
      if (display.startsWith('block') || display === 'list-item') blocks.add(n);
    }
    n = walker.nextNode();
  }
  return [...blocks];
}

/** Apply an arbitrary font size (in points) to the current selection. */
export function setFontSize(root: HTMLElement, pt: number): void {
  ensureCssMode();
  document.execCommand('fontSize', false, '7');
  const tagged = root.querySelectorAll('font[size="7"]');
  tagged.forEach((font) => {
    const span = document.createElement('span');
    span.style.fontSize = `${pt}pt`;
    while (font.firstChild) span.appendChild(font.firstChild);
    font.replaceWith(span);
  });
}

export function setFontFamily(family: string): void {
  execFormat('fontName', family);
}

export function setForeColor(color: string): void {
  execFormat('foreColor', color);
}

export function setHighlightColor(color: string): void {
  ensureCssMode();
  // hiliteColor is the spec name; some engines only honour backColor.
  if (!document.execCommand('hiliteColor', false, color)) {
    document.execCommand('backColor', false, color);
  }
}

export function setLineSpacing(root: HTMLElement, multiplier: number): void {
  const blocks = getSelectedBlocks(root);
  blocks.forEach((block) => {
    block.style.lineHeight = String(multiplier);
  });
}

export function setBlockFormat(tag: string): void {
  execFormat('formatBlock', `<${tag}>`);
}

export function insertHtmlAtCaret(html: string): void {
  ensureCssMode();
  if (!document.execCommand('insertHTML', false, html)) {
    const sel = getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const template = document.createElement('template');
    template.innerHTML = html;
    range.insertNode(template.content);
  }
}

export function createLink(url: string): void {
  execFormat('createLink', url);
}

export function clearFormatting(): void {
  execFormat('removeFormat');
  execFormat('formatBlock', '<p>');
}

function isCommandActive(command: string): boolean {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

function queryCommandValueSafe(command: string): string {
  try {
    return document.queryCommandValue(command) || '';
  } catch {
    return '';
  }
}

export function readFormatState(root: HTMLElement): SelectionFormatState {
  const sel = getSelection();
  let fontSize = '';
  let blockFormat = 'p';

  if (sel && sel.rangeCount > 0) {
    let node: Node | null = sel.getRangeAt(0).startContainer;
    if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (node instanceof HTMLElement) {
      const computed = window.getComputedStyle(node);
      const px = parseFloat(computed.fontSize);
      if (!Number.isNaN(px)) fontSize = `${Math.round((px * 72) / 96)}`;
      const block = node.closest('h1,h2,h3,h4,h5,h6,blockquote,pre,p');
      if (block && root.contains(block)) blockFormat = block.tagName.toLowerCase();
    }
  }

  return {
    bold: isCommandActive('bold'),
    italic: isCommandActive('italic'),
    underline: isCommandActive('underline'),
    strikeThrough: isCommandActive('strikeThrough'),
    subscript: isCommandActive('subscript'),
    superscript: isCommandActive('superscript'),
    alignLeft: isCommandActive('justifyLeft'),
    alignCenter: isCommandActive('justifyCenter'),
    alignRight: isCommandActive('justifyRight'),
    alignJustify: isCommandActive('justifyFull'),
    unorderedList: isCommandActive('insertUnorderedList'),
    orderedList: isCommandActive('insertOrderedList'),
    fontName: queryCommandValueSafe('fontName').replace(/['"]/g, ''),
    fontSize,
    foreColor: queryCommandValueSafe('foreColor'),
    backColor: queryCommandValueSafe('backColor'),
    blockFormat,
  };
}

export const EMPTY_FORMAT_STATE: SelectionFormatState = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  subscript: false,
  superscript: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
  unorderedList: false,
  orderedList: false,
  fontName: '',
  fontSize: '',
  foreColor: '',
  backColor: '',
  blockFormat: 'p',
};
