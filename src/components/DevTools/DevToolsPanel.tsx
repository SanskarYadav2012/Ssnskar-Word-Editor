import { useMemo, useState } from 'react';
import { Terminal, Activity, Network, Flag, Trash2, RefreshCw, Play } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useUI } from '@/context/UIContext';
import { useDev } from '@/context/DevContext';
import { useEditor } from '@/context/EditorContext';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';
import type { FeatureFlags } from '@/types';

type DevTab = 'perf' | 'dom' | 'console' | 'flags';

const FLAG_LABELS: Record<keyof FeatureFlags, string> = {
  experimentalWasmParser: 'Rust/WASM text parser',
  experimentalGrammar: 'Grammar suggestions (beta)',
  liveCollaboration: 'Live collaboration (beta)',
  focusMode: 'Focus mode',
  typewriterScrolling: 'Typewriter scrolling',
};

export function DevToolsPanel() {
  const { modal, closeModal } = useUI();
  const open = modal === 'dev';
  const [tab, setTab] = useState<DevTab>('perf');

  return (
    <Modal open={open} onClose={closeModal} title="Developer Options" icon={<Terminal size={18} />} width={680}>
      <div className="mb-4 flex gap-1 border-b border-app-border">
        <TabBtn active={tab === 'perf'} onClick={() => setTab('perf')} icon={<Activity size={15} />} label="Performance" />
        <TabBtn active={tab === 'dom'} onClick={() => setTab('dom')} icon={<Network size={15} />} label="DOM Inspector" />
        <TabBtn active={tab === 'console'} onClick={() => setTab('console')} icon={<Terminal size={15} />} label="Console" />
        <TabBtn active={tab === 'flags'} onClick={() => setTab('flags')} icon={<Flag size={15} />} label="Feature Flags" />
      </div>

      {tab === 'perf' && <PerformanceView active={open && tab === 'perf'} />}
      {tab === 'dom' && <DomInspector />}
      {tab === 'console' && <ConsoleView />}
      {tab === 'flags' && <FlagsView />}
    </Modal>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm ${
        active ? 'border-app-accent text-app-accent-strong' : 'border-transparent text-app-muted hover:text-app-text'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Metric({ label, value, unit }: { label: string; value: number | string | null; unit?: string }) {
  return (
    <div className="rounded-lg border border-app-border bg-app-surface-2 p-3">
      <div className="text-xs text-app-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">
        {value === null ? 'n/a' : value}
        {value !== null && unit && <span className="ml-1 text-sm font-normal text-app-muted">{unit}</span>}
      </div>
    </div>
  );
}

function PerformanceView({ active }: { active: boolean }) {
  const perf = usePerformanceMonitor(active);
  const heapPct =
    perf.usedJsHeapMb !== null && perf.jsHeapLimitMb
      ? Math.round((perf.usedJsHeapMb / perf.jsHeapLimitMb) * 100)
      : null;
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="JS Heap (RAM)" value={perf.usedJsHeapMb} unit="MB" />
        <Metric label="Heap allocated" value={perf.totalJsHeapMb} unit="MB" />
        <Metric label="Heap limit" value={perf.jsHeapLimitMb} unit="MB" />
        <Metric label="Frame rate" value={perf.fps} unit="fps" />
        <Metric label="DOM nodes" value={perf.domNodes} />
        <Metric label="Heap usage" value={heapPct} unit="%" />
      </div>
      <p className="mt-3 text-xs text-app-muted">
        Heap metrics use the Chromium <code>performance.memory</code> API and show <code>n/a</code> on
        engines that do not expose it. CPU is approximated by frame rate.
      </p>
    </div>
  );
}

interface DomNode {
  tag: string;
  id: string;
  className: string;
  childCount: number;
  text: string;
  children: DomNode[];
}

function serializeDom(el: Element, depth: number): DomNode {
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id,
    className: typeof el.className === 'string' ? el.className : '',
    childCount: el.children.length,
    text: el.children.length === 0 ? (el.textContent ?? '').trim().slice(0, 40) : '',
    children: depth > 0 ? [...el.children].map((c) => serializeDom(c, depth - 1)) : [],
  };
}

function DomTree({ node, depth = 0 }: { node: DomNode; depth?: number }) {
  const [openNode, setOpenNode] = useState(depth < 2);
  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 14 }}>
      <button
        onClick={() => setOpenNode((v) => !v)}
        className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-left font-mono text-xs hover:bg-app-surface-2"
      >
        <span className="text-app-muted">{node.children.length > 0 ? (openNode ? '▾' : '▸') : '•'}</span>
        <span className="text-app-accent-strong">&lt;{node.tag}</span>
        {node.id && <span className="text-green-500">#{node.id}</span>}
        {node.className && <span className="text-amber-500">.{node.className.split(' ')[0]}</span>}
        <span className="text-app-accent-strong">&gt;</span>
        {node.text && <span className="truncate text-app-muted">“{node.text}”</span>}
      </button>
      {openNode && node.children.map((child, i) => <DomTree key={i} node={child} depth={depth + 1} />)}
    </div>
  );
}

function DomInspector() {
  const editor = useEditor();
  const [version, setVersion] = useState(0);
  const tree = useMemo(() => {
    const root = editor.getEditor();
    return root ? serializeDom(root, 6) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, version]);

  return (
    <div>
      <button
        onClick={() => setVersion((v) => v + 1)}
        className="mb-2 flex items-center gap-1.5 rounded-md border border-app-border px-2 py-1 text-xs hover:bg-app-surface-2"
      >
        <RefreshCw size={13} /> Refresh
      </button>
      <div className="thin-scroll max-h-72 overflow-auto rounded-lg border border-app-border bg-app-surface-2 p-2">
        {tree ? <DomTree node={tree} /> : <p className="text-sm text-app-muted">Editor not ready.</p>}
      </div>
    </div>
  );
}

function ConsoleView() {
  const { logs, clearLogs } = useDev();
  const [expr, setExpr] = useState('');

  const run = () => {
    if (!expr.trim()) return;
    try {
      // Developer console: evaluate an expression and log the result.
      const fn = new Function(`return (${expr});`);
      const result = fn();
      logger.info(`› ${expr}  ⇒  ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`› ${expr}  ⇒  ${err instanceof Error ? err.message : String(err)}`);
    }
    setExpr('');
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-app-muted">{logs.length} log entries</span>
        <button onClick={clearLogs} className="flex items-center gap-1 rounded-md border border-app-border px-2 py-1 text-xs hover:bg-app-surface-2">
          <Trash2 size={13} /> Clear
        </button>
      </div>
      <div className="thin-scroll mb-2 max-h-56 overflow-auto rounded-lg border border-app-border bg-[#0f172a] p-2 font-mono text-xs text-slate-200">
        {logs.length === 0 && <div className="text-slate-500">No logs yet.</div>}
        {logs.map((entry) => (
          <div
            key={entry.id}
            className={
              entry.level === 'error'
                ? 'text-red-400'
                : entry.level === 'warn'
                  ? 'text-amber-300'
                  : entry.level === 'debug'
                    ? 'text-slate-400'
                    : 'text-slate-200'
            }
          >
            <span className="text-slate-500">{new Date(entry.timestamp).toLocaleTimeString()} </span>
            [{entry.level}] {entry.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Evaluate JS expression, e.g. 2 + 2"
          className="flex-1 rounded-md border border-app-border bg-app-surface-2 px-3 py-2 font-mono text-xs outline-none focus:border-app-accent"
        />
        <button onClick={run} className="flex items-center gap-1 rounded-md bg-app-accent px-3 py-2 text-sm font-medium text-white hover:bg-app-accent-strong">
          <Play size={14} /> Run
        </button>
      </div>
    </div>
  );
}

function FlagsView() {
  const { flags, setFlag } = useDev();
  return (
    <div className="space-y-2">
      {(Object.keys(flags) as (keyof FeatureFlags)[]).map((key) => (
        <label
          key={key}
          className="flex items-center justify-between rounded-lg border border-app-border bg-app-surface-2 px-3 py-2"
        >
          <span className="text-sm">{FLAG_LABELS[key]}</span>
          <input
            type="checkbox"
            checked={flags[key]}
            onChange={(e) => setFlag(key, e.target.checked)}
            className="h-4 w-4 accent-[var(--app-accent)]"
          />
        </label>
      ))}
      <p className="text-xs text-app-muted">
        Feature flags are persisted locally. Toggling “Rust/WASM text parser” routes word-count
        through the native accelerator when it has been built (<code>npm run wasm:build</code>).
      </p>
    </div>
  );
}
