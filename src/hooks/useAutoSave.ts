import { useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { useUI } from '@/context/UIContext';
import { saveString } from '@/utils/storage';
import { logger } from '@/utils/logger';

const CONTENT_KEY = 'sanskar.document.html';
const TITLE_KEY = 'sanskar.document.title';

/** Periodically persists the document to localStorage for crash recovery. */
export function useAutoSave() {
  const editor = useEditor();
  const { settings } = useSettings();
  const { showToast } = useUI();

  useEffect(() => {
    if (!settings.autoSaveEnabled) return;
    const interval = window.setInterval(() => {
      if (!editor.dirty) return;
      const root = editor.getEditor();
      if (!root) return;
      saveString(CONTENT_KEY, root.innerHTML);
      saveString(TITLE_KEY, editor.title);
      editor.markSaved();
      logger.debug('Auto-saved document to local storage.');
      showToast('Auto-saved');
    }, settings.autoSaveIntervalSec * 1000);

    return () => window.clearInterval(interval);
  }, [settings.autoSaveEnabled, settings.autoSaveIntervalSec, editor, showToast]);
}
