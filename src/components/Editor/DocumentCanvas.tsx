import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useSettings } from '@/context/SettingsContext';
import { useDev } from '@/context/DevContext';
import { MM_TO_PX, PAGE_DIMENSIONS_MM } from '@/types';
import { EditorSurface } from './EditorSurface';

export function DocumentCanvas() {
  const { settings } = useSettings();
  const { flags } = useDev();
  const editor = useEditor();
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageCount, setLocalPageCount] = useState(1);

  const dims = PAGE_DIMENSIONS_MM[settings.pageSize];
  const pageWidthPx = dims.width * MM_TO_PX;
  const pageHeightPx = dims.height * MM_TO_PX;
  const margins = useMemo(
    () => ({
      top: settings.margins.top * MM_TO_PX,
      right: settings.margins.right * MM_TO_PX,
      bottom: settings.margins.bottom * MM_TO_PX,
      left: settings.margins.left * MM_TO_PX,
    }),
    [settings.margins],
  );

  // Recompute the simulated page count whenever the page height changes.
  useLayoutEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const measure = () => {
      const total = el.scrollHeight;
      const count = Math.max(1, Math.ceil(total / pageHeightPx));
      setLocalPageCount(count);
      editor.setPageCount(count);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageHeightPx, editor]);

  const zoom = settings.zoom / 100;

  const breakGuides = useMemo(
    () =>
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => (i + 1) * pageHeightPx),
    [pageCount, pageHeightPx],
  );

  return (
    <div
      className={`canvas-scroll relative flex-1 overflow-auto bg-app-bg ${
        flags.focusMode ? 'py-16' : 'py-8'
      }`}
    >
      <div className="flex min-h-full justify-center px-6">
        <div
          style={{ zoom, width: pageWidthPx }}
          className={flags.focusMode ? 'opacity-100' : ''}
        >
          <div
            ref={pageRef}
            className="sanskar-page relative mx-auto rounded-sm"
            style={{
              width: pageWidthPx,
              minHeight: pageHeightPx,
              paddingTop: margins.top,
              paddingBottom: margins.bottom,
              paddingLeft: margins.left,
              paddingRight: margins.right,
            }}
          >
            {/* Page-break guide lines (visual pagination). */}
            {breakGuides.map((top, i) => (
              <div
                key={i}
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 flex items-center"
                style={{ top }}
              >
                <div className="h-px flex-1 border-t border-dashed border-app-border opacity-60" />
                <span className="ml-2 mr-1 rounded bg-app-surface-2 px-1.5 py-0.5 text-[9px] text-app-muted">
                  Page {i + 2}
                </span>
              </div>
            ))}

            <div
              id="sanskar-header"
              className="running-zone mb-2 border-b border-dashed border-app-border/60 pb-1"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Header"
              onInput={() => editor.notifyChange()}
            />

            <EditorSurface />

            <div className="mt-3 flex items-end justify-between border-t border-dashed border-app-border/60 pt-1">
              <div
                id="sanskar-footer"
                className="running-zone flex-1"
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Footer"
                onInput={() => editor.notifyChange()}
              />
              <span className="running-zone ml-3 shrink-0 text-right">
                Page 1 of {pageCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
