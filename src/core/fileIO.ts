import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import { htmlToDocxBlob } from './docx';
import html2canvas from 'html2canvas';
import type { AppSettings, SanskarDocument, SupportedExtension } from '@/types';
import { logger } from '@/utils/logger';

export interface ImportResult {
  title: string;
  html: string;
  settings?: Partial<AppSettings>;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'Untitled';
}

function htmlToPlainText(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.innerText;
}

function wrapDocument(html: string, title: string, fontFamily: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
body{font-family:${fontFamily},'Calibri',sans-serif;font-size:11pt;color:#111;line-height:1.5;}
table{border-collapse:collapse;}td,th{border:1px solid #888;padding:6px 10px;}
pre{background:#0f172a;color:#e2e8f0;padding:12px;border-radius:6px;font-family:'Roboto Mono',monospace;}
img{max-width:100%;}
</style></head><body>${html}</body></html>`;
}

/* ----------------------------- Exporters ----------------------------- */

export function exportTxt(html: string, title: string): void {
  const blob = new Blob([htmlToPlainText(html)], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${sanitizeFilename(title)}.txt`);
  logger.info(`Exported "${title}.txt".`);
}

export function exportHtml(html: string, title: string, fontFamily: string): void {
  const blob = new Blob([wrapDocument(html, title, fontFamily)], {
    type: 'text/html;charset=utf-8',
  });
  saveAs(blob, `${sanitizeFilename(title)}.html`);
  logger.info(`Exported "${title}.html".`);
}

export function exportSanskar(
  html: string,
  title: string,
  settings?: Partial<AppSettings>,
): void {
  const now = new Date().toISOString();
  const doc: SanskarDocument = {
    format: 'sanskar',
    version: 1,
    title,
    html,
    createdAt: now,
    updatedAt: now,
    settings,
  };
  const blob = new Blob([JSON.stringify(doc, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  saveAs(blob, `${sanitizeFilename(title)}.sanskar`);
  logger.info(`Saved "${title}.sanskar".`);
}

export function exportDocx(html: string, title: string, fontFamily: string): void {
  const blob = htmlToDocxBlob(wrapDocument(html, title, fontFamily));
  saveAs(blob, `${sanitizeFilename(title)}.docx`);
  logger.info(`Exported "${title}.docx".`);
}

/**
 * Minimal but valid RTF export. Converts the document's plain text with basic
 * paragraph breaks; RTF is intentionally lightweight to remain dependency-free.
 */
export function exportRtf(html: string, title: string): void {
  const text = htmlToPlainText(html);
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\r?\n/g, '\\par\n');
  const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Calibri;}}\\fs22 ${escaped}}`;
  const blob = new Blob([rtf], { type: 'application/rtf' });
  saveAs(blob, `${sanitizeFilename(title)}.rtf`);
  logger.info(`Exported "${title}.rtf".`);
}

export async function exportPdf(element: HTMLElement, title: string): Promise<void> {
  logger.info('Rendering PDF…');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  await pdf.html(element, {
    margin: [24, 24, 24, 24],
    autoPaging: 'text',
    html2canvas: { scale: 0.92, useCORS: true, backgroundColor: '#ffffff' },
    width: pageWidth - 48,
    windowWidth: element.scrollWidth,
  });
  pdf.save(`${sanitizeFilename(title)}.pdf`);
  logger.info(`Exported "${title}.pdf".`);
}

/** Snapshot export — rasterises the visible page(s). Useful when exact layout
 *  fidelity matters more than selectable text. */
export async function exportPdfSnapshot(element: HTMLElement, title: string): Promise<void> {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#fff' });
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = canvas.height / canvas.width;
  const imgHeight = pageWidth * ratio;
  let remaining = imgHeight;
  let position = 0;
  pdf.addImage(img, 'PNG', 0, position, pageWidth, imgHeight);
  remaining -= pageHeight;
  while (remaining > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(img, 'PNG', 0, position, pageWidth, imgHeight);
    remaining -= pageHeight;
  }
  pdf.save(`${sanitizeFilename(title)}.pdf`);
  logger.info(`Exported "${title}.pdf" (snapshot).`);
}

/* ----------------------------- Importers ----------------------------- */

export function extensionOf(filename: string): SupportedExtension | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  if (['sanskar', 'docx', 'pdf', 'txt', 'rtf', 'html'].includes(ext)) {
    return ext as SupportedExtension;
  }
  if (ext === 'htm') return 'html';
  return null;
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function plainTextToHtml(text: string): string {
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc
    .split(/\r?\n/)
    .map((line) => (line.trim() ? `<p>${line}</p>` : '<p><br></p>'))
    .join('');
}

function stripBodyHtml(raw: string): string {
  const match = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : raw;
}

export async function importFile(file: File): Promise<ImportResult> {
  const ext = extensionOf(file.name);
  const baseTitle = file.name.replace(/\.[^.]+$/, '');

  switch (ext) {
    case 'txt': {
      const text = await readAsText(file);
      return { title: baseTitle, html: plainTextToHtml(text) };
    }
    case 'html': {
      const raw = await readAsText(file);
      return { title: baseTitle, html: stripBodyHtml(raw) };
    }
    case 'rtf': {
      const raw = await readAsText(file);
      const text = raw
        .replace(/\\par[d]?/g, '\n')
        .replace(/\{[^{}]*\}/g, '')
        .replace(/\\[a-z]+-?\d* ?/gi, '')
        .replace(/[{}]/g, '')
        .trim();
      return { title: baseTitle, html: plainTextToHtml(text) };
    }
    case 'sanskar': {
      const raw = await readAsText(file);
      const doc = JSON.parse(raw) as SanskarDocument;
      if (doc.format !== 'sanskar') throw new Error('Not a valid .sanskar file.');
      return { title: doc.title || baseTitle, html: doc.html, settings: doc.settings };
    }
    case 'docx': {
      const buffer = await readAsArrayBuffer(file);
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
      result.messages.forEach((m) => logger.debug(`docx import: ${m.message}`));
      return { title: baseTitle, html: result.value || '<p><br></p>' };
    }
    case 'pdf': {
      throw new Error(
        'Importing PDF content is not supported (PDF is a fixed-layout format). Use Export to save as PDF instead.',
      );
    }
    default:
      throw new Error(`Unsupported file type: ${file.name}`);
  }
}

/** Open the native file picker and import the chosen document. */
export function openFileDialog(): Promise<ImportResult | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sanskar,.docx,.txt,.rtf,.html,.htm';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      try {
        resolve(await importFile(file));
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
}
