import type { RibbonTabId } from '@/types';
import { useUI } from '@/context/UIContext';
import { TopBar } from './TopBar';
import { HomeTab } from './tabs/HomeTab';
import { InsertTab } from './tabs/InsertTab';
import { LayoutTab } from './tabs/LayoutTab';
import { ReferencesTab } from './tabs/ReferencesTab';
import { ReviewTab } from './tabs/ReviewTab';
import { ViewTab } from './tabs/ViewTab';

const TABS: { id: RibbonTabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'layout', label: 'Layout' },
  { id: 'references', label: 'References' },
  { id: 'review', label: 'Review' },
  { id: 'view', label: 'View' },
];

const TAB_CONTENT: Record<RibbonTabId, React.FC> = {
  home: HomeTab,
  insert: InsertTab,
  layout: LayoutTab,
  references: ReferencesTab,
  review: ReviewTab,
  view: ViewTab,
};

export function Ribbon() {
  const { activeTab, setActiveTab } = useUI();
  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <header className="z-20 shrink-0 select-none bg-app-ribbon shadow-ribbon">
      <TopBar />
      <nav className="flex items-center gap-1 border-b border-app-border px-2" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-app-accent-strong'
                : 'text-app-text hover:text-app-accent'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-app-accent" />
            )}
          </button>
        ))}
      </nav>
      <div className="thin-scroll flex min-h-[84px] items-stretch gap-1 overflow-x-auto bg-app-surface px-2 py-1.5">
        <ActiveContent />
      </div>
    </header>
  );
}
