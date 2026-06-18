export type ThemeName = 'light' | 'dark' | 'system' | 'gold';

export type RibbonTabId = 'home' | 'insert' | 'layout' | 'references' | 'review' | 'view';

export interface AppSettings {
  theme: ThemeName;
  defaultFontFamily: string;
  defaultFontSize: number;
  autoSaveEnabled: boolean;
  autoSaveIntervalSec: number;
  spellCheckEnabled: boolean;
  showRuler: boolean;
  language: string;
  zoom: number;
  pageSize: PageSizeName;
  margins: PageMargins;
}

export type PageSizeName = 'A4' | 'Letter' | 'Legal';

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SelectionFormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  subscript: boolean;
  superscript: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  alignJustify: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  fontName: string;
  fontSize: string;
  foreColor: string;
  backColor: string;
  blockFormat: string;
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  pages: number;
  readingTimeMin: number;
}

export interface SanskarDocument {
  format: 'sanskar';
  version: number;
  title: string;
  html: string;
  createdAt: string;
  updatedAt: string;
  settings?: Partial<AppSettings>;
}

export type SupportedExtension = 'sanskar' | 'docx' | 'pdf' | 'txt' | 'rtf' | 'html';

export interface LogEntry {
  id: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: number;
}

export interface FeatureFlags {
  experimentalWasmParser: boolean;
  experimentalGrammar: boolean;
  liveCollaboration: boolean;
  focusMode: boolean;
  typewriterScrolling: boolean;
}

export interface PerformanceSnapshot {
  usedJsHeapMb: number | null;
  totalJsHeapMb: number | null;
  jsHeapLimitMb: number | null;
  fps: number;
  domNodes: number;
}

export const PAGE_DIMENSIONS_MM: Record<PageSizeName, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
};

export const MM_TO_PX = 96 / 25.4;
