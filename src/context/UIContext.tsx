import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { RibbonTabId } from '@/types';

export type ModalName =
  | 'settings'
  | 'dev'
  | 'find'
  | 'table'
  | 'link'
  | 'image'
  | 'symbol'
  | 'equation'
  | 'about'
  | 'shortcuts'
  | null;

interface UIContextValue {
  activeTab: RibbonTabId;
  setActiveTab: (tab: RibbonTabId) => void;
  modal: ModalName;
  openModal: (name: Exclude<ModalName, null>) => void;
  closeModal: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<RibbonTabId>('home');
  const [modal, setModal] = useState<ModalName>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const openModal = useCallback((name: Exclude<ModalName, null>) => setModal(name), []);
  const closeModal = useCallback(() => setModal(null), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 3200);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      modal,
      openModal,
      closeModal,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen,
      toast,
      showToast,
    }),
    [activeTab, modal, openModal, closeModal, sidebarOpen, toggleSidebar, toast, showToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
