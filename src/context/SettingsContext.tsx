import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppSettings, ThemeName } from '@/types';
import { DEFAULT_SETTINGS } from '@/utils/constants';
import { loadJSON, saveJSON } from '@/utils/storage';

const STORAGE_KEY = 'sanskar.settings.v1';

interface SettingsContextValue {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeName) => void;
  setZoom: (zoom: number) => void;
  reset: () => void;
  resolvedTheme: 'light' | 'dark' | 'gold';
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function resolveTheme(theme: ThemeName): 'light' | 'dark' | 'gold' {
  if (theme === 'system') {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return theme;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadJSON<AppSettings>(STORAGE_KEY, DEFAULT_SETTINGS),
  );
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'gold'>(() =>
    resolveTheme(settings.theme),
  );

  useEffect(() => {
    saveJSON(STORAGE_KEY, settings);
  }, [settings]);

  useEffect(() => {
    setResolvedTheme(resolveTheme(settings.theme));
    if (settings.theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolvedTheme(resolveTheme('system'));
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const setTheme = useCallback((theme: ThemeName) => update({ theme }), [update]);
  const setZoom = useCallback(
    (zoom: number) => update({ zoom: Math.max(25, Math.min(300, Math.round(zoom))) }),
    [update],
  );
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, update, setTheme, setZoom, reset, resolvedTheme }),
    [settings, update, setTheme, setZoom, reset, resolvedTheme],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
