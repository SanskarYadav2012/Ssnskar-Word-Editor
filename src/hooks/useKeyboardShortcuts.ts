import { useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { useUI } from '@/context/UIContext';
import { useFileActions } from './useFileActions';

/** Global keyboard shortcuts. Inline formatting (Ctrl+B/I/U) is handled
 *  natively by the contentEditable engine; this layer adds app-level commands. */
export function useKeyboardShortcuts() {
  const editor = useEditor();
  const { settings, setZoom } = useSettings();
  const { openModal } = useUI();
  const { saveDefault, open, print } = useFileActions();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();

      switch (key) {
        case 's':
          e.preventDefault();
          saveDefault();
          break;
        case 'o':
          e.preventDefault();
          open();
          break;
        case 'p':
          e.preventDefault();
          print();
          break;
        case 'f':
          e.preventDefault();
          openModal('find');
          break;
        case 'k':
          e.preventDefault();
          editor.saveSelection();
          openModal('link');
          break;
        case 'x':
          if (e.shiftKey) {
            e.preventDefault();
            editor.runInline('strikeThrough');
          }
          break;
        case '=':
        case '+':
          e.preventDefault();
          setZoom(settings.zoom + 10);
          break;
        case '-':
          e.preventDefault();
          setZoom(settings.zoom - 10);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editor, openModal, saveDefault, open, print, setZoom, settings.zoom]);
}
