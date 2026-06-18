import { useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { useUI } from '@/context/UIContext';
import {
  exportDocx,
  exportHtml,
  exportPdf,
  exportRtf,
  exportSanskar,
  exportTxt,
  openFileDialog,
} from '@/core/fileIO';
import type { SupportedExtension } from '@/types';
import { logger } from '@/utils/logger';

export function useFileActions() {
  const editor = useEditor();
  const { settings, update } = useSettings();
  const { showToast } = useUI();

  const newDocument = useCallback(() => {
    if (editor.dirty && !window.confirm('Discard unsaved changes and start a new document?')) {
      return;
    }
    editor.clearDocument();
    showToast('New document created');
  }, [editor, showToast]);

  const open = useCallback(async () => {
    try {
      const result = await openFileDialog();
      if (!result) return;
      editor.setHTML(result.html);
      editor.setTitle(result.title);
      editor.markSaved();
      if (result.settings) update(result.settings);
      showToast(`Opened "${result.title}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to open file';
      logger.error(message);
      showToast(message);
    }
  }, [editor, update, showToast]);

  const exportAs = useCallback(
    async (ext: SupportedExtension) => {
      const html = editor.getHTML();
      const title = editor.title;
      try {
        switch (ext) {
          case 'sanskar':
            exportSanskar(html, title, settings);
            editor.markSaved();
            break;
          case 'docx':
            exportDocx(html, title, settings.defaultFontFamily);
            break;
          case 'txt':
            exportTxt(html, title);
            break;
          case 'rtf':
            exportRtf(html, title);
            break;
          case 'html':
            exportHtml(html, title, settings.defaultFontFamily);
            break;
          case 'pdf': {
            const page = document.querySelector<HTMLElement>('.sanskar-page');
            if (!page) throw new Error('Document surface not found');
            showToast('Generating PDF…');
            await exportPdf(page, title);
            break;
          }
        }
        showToast(`Exported as .${ext}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : `Failed to export .${ext}`;
        logger.error(message);
        showToast(message);
      }
    },
    [editor, settings, showToast],
  );

  const saveDefault = useCallback(() => exportAs('sanskar'), [exportAs]);

  const print = useCallback(() => {
    window.print();
  }, []);

  return { newDocument, open, exportAs, saveDefault, print };
}
