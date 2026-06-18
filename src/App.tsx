import { SettingsProvider } from '@/context/SettingsContext';
import { DevProvider } from '@/context/DevContext';
import { EditorProvider } from '@/context/EditorContext';
import { UIProvider } from '@/context/UIContext';
import { Ribbon } from '@/components/Ribbon/Ribbon';
import { DocumentCanvas } from '@/components/Editor/DocumentCanvas';
import { SocialSidebar } from '@/components/Sidebar/SocialSidebar';
import { StatusBar } from '@/components/StatusBar/StatusBar';
import { ModalRoot } from '@/components/ModalRoot';
import { Toast } from '@/components/common/Toast';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';

function AppShell() {
  useKeyboardShortcuts();
  useAutoSave();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-app-bg text-app-text">
      <Ribbon />
      <div className="flex min-h-0 flex-1">
        <DocumentCanvas />
        <SocialSidebar />
      </div>
      <StatusBar />
      <ModalRoot />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <DevProvider>
        <EditorProvider>
          <UIProvider>
            <AppShell />
          </UIProvider>
        </EditorProvider>
      </DevProvider>
    </SettingsProvider>
  );
}
