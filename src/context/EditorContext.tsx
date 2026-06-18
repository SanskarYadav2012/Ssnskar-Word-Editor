import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { DocumentStats, SelectionFormatState } from '@/types';
import {
  EMPTY_FORMAT_STATE,
  execFormat,
  createLink as createLinkCmd,
  insertHtmlAtCaret,
  readFormatState,
  setBlockFormat as setBlockFormatCmd,
  setFontFamily as setFontFamilyCmd,
  setFontSize as setFontSizeCmd,
  setForeColor as setForeColorCmd,
  setHighlightColor as setHighlightCmd,
  setLineSpacing as setLineSpacingCmd,
  clearFormatting as clearFormattingCmd,
} from '@/core/editorCommands';
import { analyzeText, extractPlainText } from '@/core/textAnalysis';
import { logger } from '@/utils/logger';
import { useDev } from './DevContext';

interface EditorContextValue {
  registerEditor: (el: HTMLDivElement | null) => void;
  getEditor: () => HTMLDivElement | null;
  isReady: boolean;
  formatState: SelectionFormatState;
  stats: DocumentStats;
  engine: 'wasm' | 'js';
  title: string;
  setTitle: (title: string) => void;
  dirty: boolean;
  markSaved: () => void;
  lastSavedAt: number | null;

  focus: () => void;
  saveSelection: () => void;
  restoreSelection: () => void;

  runInline: (command: string) => void;
  setAlignment: (align: 'Left' | 'Center' | 'Right' | 'Full') => void;
  toggleList: (type: 'ordered' | 'unordered') => void;
  indent: () => void;
  outdent: () => void;
  setFontFamily: (family: string) => void;
  setFontSize: (pt: number) => void;
  setForeColor: (color: string) => void;
  setHighlight: (color: string) => void;
  setLineSpacing: (multiplier: number) => void;
  setBlockFormat: (tag: string) => void;
  clearFormatting: () => void;

  insertHTML: (html: string) => void;
  insertTable: (rows: number, cols: number, withHeader: boolean) => void;
  insertImage: (src: string, alt?: string) => void;
  insertLink: (url: string, text: string) => void;
  insertCodeBlock: () => void;
  insertShape: (shape: 'rectangle' | 'circle' | 'triangle' | 'line' | 'star') => void;
  insertHorizontalRule: () => void;
  insertPageBreak: () => void;
  insertEquation: (latexLike: string) => void;
  insertSpecialChar: (char: string) => void;

  undo: () => void;
  redo: () => void;

  getHTML: () => string;
  setHTML: (html: string) => void;
  clearDocument: () => void;
  setPageCount: (count: number) => void;
  refresh: () => void;
  notifyChange: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

const EMPTY_STATS: DocumentStats = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  pages: 1,
  readingTimeMin: 0,
};

export function EditorProvider({ children }: { children: ReactNode }) {
  const { flags } = useDev();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const statsTimer = useRef<number | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [formatState, setFormatState] = useState<SelectionFormatState>(EMPTY_FORMAT_STATE);
  const [stats, setStats] = useState<DocumentStats>(EMPTY_STATS);
  const [engine, setEngine] = useState<'wasm' | 'js'>('js');
  const [pageCount, setPageCount] = useState(1);
  const [title, setTitle] = useState('Untitled Document');
  const [dirty, setDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const preferWasm = flags.experimentalWasmParser;

  const focus = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const range = savedRangeRef.current;
    const sel = window.getSelection();
    if (range && sel) {
      editorRef.current?.focus();
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editorRef.current?.focus();
    }
  }, []);

  const refreshFormatState = useCallback(() => {
    if (!editorRef.current) return;
    setFormatState(readFormatState(editorRef.current));
  }, []);

  const recomputeStats = useCallback(() => {
    if (statsTimer.current) window.clearTimeout(statsTimer.current);
    statsTimer.current = window.setTimeout(async () => {
      const el = editorRef.current;
      if (!el) return;
      const text = extractPlainText(el);
      const { stats: base, engine: usedEngine } = await analyzeText(text, preferWasm);
      setEngine(usedEngine);
      setStats({ ...base, pages: Math.max(1, pageCount) });
    }, 180);
  }, [preferWasm, pageCount]);

  const notifyChange = useCallback(() => {
    setDirty(true);
    recomputeStats();
    refreshFormatState();
  }, [recomputeStats, refreshFormatState]);

  const refresh = useCallback(() => {
    refreshFormatState();
    recomputeStats();
  }, [refreshFormatState, recomputeStats]);

  useEffect(() => {
    setStats((prev) => ({ ...prev, pages: Math.max(1, pageCount) }));
  }, [pageCount]);

  // Wire selection + input listeners when the editor element registers.
  const registerEditor = useCallback(
    (el: HTMLDivElement | null) => {
      editorRef.current = el;
      setIsReady(Boolean(el));
      if (el) {
        setTimeout(() => {
          refreshFormatState();
          recomputeStats();
        }, 0);
      }
    },
    [refreshFormatState, recomputeStats],
  );

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && editorRef.current?.contains(sel.anchorNode)) {
        refreshFormatState();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [refreshFormatState]);

  const withEditor = useCallback(
    (fn: (el: HTMLDivElement) => void) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      restoreSelection();
      fn(el);
      notifyChange();
    },
    [restoreSelection, notifyChange],
  );

  const runInline = useCallback(
    (command: string) => withEditor(() => execFormat(command)),
    [withEditor],
  );

  const setAlignment = useCallback(
    (align: 'Left' | 'Center' | 'Right' | 'Full') =>
      withEditor(() => execFormat(`justify${align}`)),
    [withEditor],
  );

  const toggleList = useCallback(
    (type: 'ordered' | 'unordered') =>
      withEditor(() =>
        execFormat(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList'),
      ),
    [withEditor],
  );

  const indent = useCallback(() => withEditor(() => execFormat('indent')), [withEditor]);
  const outdent = useCallback(() => withEditor(() => execFormat('outdent')), [withEditor]);

  const setFontFamily = useCallback(
    (family: string) => withEditor(() => setFontFamilyCmd(family)),
    [withEditor],
  );
  const setFontSize = useCallback(
    (pt: number) => withEditor((el) => setFontSizeCmd(el, pt)),
    [withEditor],
  );
  const setForeColor = useCallback(
    (color: string) => withEditor(() => setForeColorCmd(color)),
    [withEditor],
  );
  const setHighlight = useCallback(
    (color: string) => withEditor(() => setHighlightCmd(color)),
    [withEditor],
  );
  const setLineSpacing = useCallback(
    (multiplier: number) => withEditor((el) => setLineSpacingCmd(el, multiplier)),
    [withEditor],
  );
  const setBlockFormat = useCallback(
    (tag: string) => withEditor(() => setBlockFormatCmd(tag)),
    [withEditor],
  );
  const clearFormatting = useCallback(
    () => withEditor(() => clearFormattingCmd()),
    [withEditor],
  );

  const insertHTML = useCallback(
    (html: string) => withEditor(() => insertHtmlAtCaret(html)),
    [withEditor],
  );

  const insertTable = useCallback(
    (rows: number, cols: number, withHeader: boolean) => {
      const buildRow = (cells: number, header: boolean) => {
        const tag = header ? 'th' : 'td';
        const style = header
          ? ' style="background:#0b3aa0;color:#fff;font-weight:600;"'
          : '';
        return `<tr>${Array.from({ length: cells }, () => `<${tag}${style}><br></${tag}>`).join('')}</tr>`;
      };
      const head = withHeader ? buildRow(cols, true) : '';
      const bodyRows = Array.from({ length: withHeader ? rows - 1 : rows }, () =>
        buildRow(cols, false),
      ).join('');
      insertHTML(`<table>${head}${bodyRows}</table><p><br></p>`);
    },
    [insertHTML],
  );

  const insertImage = useCallback(
    (src: string, alt = 'image') =>
      insertHTML(`<img src="${src}" alt="${alt.replace(/"/g, '&quot;')}" />`),
    [insertHTML],
  );

  const insertLink = useCallback(
    (url: string, text: string) => {
      const safe = url.replace(/"/g, '&quot;');
      const label = text || url;
      insertHTML(`<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`);
    },
    [insertHTML],
  );

  const insertCodeBlock = useCallback(() => {
    insertHTML('<pre class="code-block"><code>// code</code></pre><p><br></p>');
  }, [insertHTML]);

  const insertShape = useCallback(
    (shape: 'rectangle' | 'circle' | 'triangle' | 'line' | 'star') => {
      const svgByShape: Record<typeof shape, string> = {
        rectangle: '<rect x="4" y="14" width="72" height="44" rx="6" fill="#1d56d6" />',
        circle: '<circle cx="36" cy="36" r="28" fill="#d4af37" />',
        triangle: '<polygon points="36,6 66,64 6,64" fill="#0b3aa0" />',
        line: '<line x1="6" y1="36" x2="66" y2="36" stroke="#1d56d6" stroke-width="5" stroke-linecap="round" />',
        star: '<polygon points="36,4 45,27 70,27 50,43 58,67 36,52 14,67 22,43 2,27 27,27" fill="#d4af37" />',
      };
      insertHTML(
        `<span class="sanskar-shape" contenteditable="false"><svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">${svgByShape[shape]}</svg></span>`,
      );
    },
    [insertHTML],
  );

  const insertHorizontalRule = useCallback(() => withEditor(() => execFormat('insertHorizontalRule')), [withEditor]);

  const insertPageBreak = useCallback(() => {
    insertHTML('<div class="page-break" style="break-after:page;page-break-after:always;"></div><p><br></p>');
  }, [insertHTML]);

  const insertEquation = useCallback(
    (latexLike: string) => {
      const safe = latexLike.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      insertHTML(
        `<span class="sanskar-equation" contenteditable="false" style="font-family:'Cambria Math','Times New Roman',serif;font-style:italic;background:#f0f4ff;padding:2px 8px;border-radius:4px;">${safe}</span>&nbsp;`,
      );
    },
    [insertHTML],
  );

  const insertSpecialChar = useCallback(
    (char: string) => insertHTML(char),
    [insertHTML],
  );

  const createLinkOnSelection = useCallback(
    (url: string) => withEditor(() => createLinkCmd(url)),
    [withEditor],
  );

  const undo = useCallback(() => withEditor(() => execFormat('undo')), [withEditor]);
  const redo = useCallback(() => withEditor(() => execFormat('redo')), [withEditor]);

  const getHTML = useCallback(() => editorRef.current?.innerHTML ?? '', []);

  const setHTML = useCallback(
    (html: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.innerHTML = html || '<p><br></p>';
      setDirty(true);
      refresh();
      logger.info('Document content replaced.');
    },
    [refresh],
  );

  const clearDocument = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = '<p><br></p>';
    setTitle('Untitled Document');
    setDirty(false);
    setLastSavedAt(null);
    refresh();
    logger.info('New document created.');
  }, [refresh]);

  const markSaved = useCallback(() => {
    setDirty(false);
    setLastSavedAt(Date.now());
  }, []);

  const value = useMemo<EditorContextValue>(
    () => ({
      registerEditor,
      getEditor: () => editorRef.current,
      isReady,
      formatState,
      stats,
      engine,
      title,
      setTitle,
      dirty,
      markSaved,
      lastSavedAt,
      focus,
      saveSelection,
      restoreSelection,
      runInline,
      setAlignment,
      toggleList,
      indent,
      outdent,
      setFontFamily,
      setFontSize,
      setForeColor,
      setHighlight,
      setLineSpacing,
      setBlockFormat,
      clearFormatting,
      insertHTML,
      insertTable,
      insertImage,
      insertLink: (url: string, text: string) => {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && editorRef.current?.contains(sel.anchorNode)) {
          createLinkOnSelection(url);
        } else {
          insertLink(url, text);
        }
      },
      insertCodeBlock,
      insertShape,
      insertHorizontalRule,
      insertPageBreak,
      insertEquation,
      insertSpecialChar,
      undo,
      redo,
      getHTML,
      setHTML,
      clearDocument,
      setPageCount,
      refresh,
      notifyChange,
    }),
    [
      registerEditor,
      isReady,
      formatState,
      stats,
      engine,
      title,
      dirty,
      markSaved,
      lastSavedAt,
      focus,
      saveSelection,
      restoreSelection,
      runInline,
      setAlignment,
      toggleList,
      indent,
      outdent,
      setFontFamily,
      setFontSize,
      setForeColor,
      setHighlight,
      setLineSpacing,
      setBlockFormat,
      clearFormatting,
      insertHTML,
      insertTable,
      insertImage,
      insertLink,
      createLinkOnSelection,
      insertCodeBlock,
      insertShape,
      insertHorizontalRule,
      insertPageBreak,
      insertEquation,
      insertSpecialChar,
      undo,
      redo,
      getHTML,
      setHTML,
      clearDocument,
      refresh,
      notifyChange,
    ],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
