import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FeatureFlags, LogEntry } from '@/types';
import { loadJSON, saveJSON } from '@/utils/storage';
import { logger } from '@/utils/logger';

const FLAGS_KEY = 'sanskar.flags.v1';

const DEFAULT_FLAGS: FeatureFlags = {
  experimentalWasmParser: false,
  experimentalGrammar: false,
  liveCollaboration: false,
  focusMode: false,
  typewriterScrolling: false,
};

interface DevContextValue {
  devUnlocked: boolean;
  unlockDev: () => void;
  lockDev: () => void;
  registerVersionClick: () => void;
  flags: FeatureFlags;
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
  logs: LogEntry[];
  clearLogs: () => void;
}

const DevContext = createContext<DevContextValue | null>(null);

export function DevProvider({ children }: { children: ReactNode }) {
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [, setClicks] = useState(0);
  const [lastClick, setLastClick] = useState(0);
  const [flags, setFlags] = useState<FeatureFlags>(() =>
    loadJSON<FeatureFlags>(FLAGS_KEY, DEFAULT_FLAGS),
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => logger.subscribe(setLogs), []);
  useEffect(() => saveJSON(FLAGS_KEY, flags), [flags]);

  const registerVersionClick = useCallback(() => {
    const now = Date.now();
    setClicks((prev) => {
      const next = now - lastClick > 1500 ? 1 : prev + 1;
      if (next >= 7 && !devUnlocked) {
        setDevUnlocked(true);
        logger.info('Developer Options unlocked.');
      }
      return next;
    });
    setLastClick(now);
  }, [lastClick, devUnlocked]);

  const setFlag = useCallback((key: keyof FeatureFlags, value: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: value }));
    logger.debug(`Feature flag "${key}" set to ${value}.`);
  }, []);

  const value = useMemo<DevContextValue>(
    () => ({
      devUnlocked,
      unlockDev: () => setDevUnlocked(true),
      lockDev: () => setDevUnlocked(false),
      registerVersionClick,
      flags,
      setFlag,
      logs,
      clearLogs: () => logger.clear(),
    }),
    [devUnlocked, registerVersionClick, flags, setFlag, logs],
  );

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDev(): DevContextValue {
  const ctx = useContext(DevContext);
  if (!ctx) throw new Error('useDev must be used within DevProvider');
  return ctx;
}
