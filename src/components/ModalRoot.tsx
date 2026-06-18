import { SettingsModal } from './Settings/SettingsModal';
import { DevToolsPanel } from './DevTools/DevToolsPanel';
import { FindReplace } from './Dialogs/FindReplace';
import { InsertTable } from './Dialogs/InsertTable';
import { InsertLink } from './Dialogs/InsertLink';
import { InsertImage } from './Dialogs/InsertImage';
import { SymbolPicker } from './Dialogs/SymbolPicker';
import { EquationDialog } from './Dialogs/EquationDialog';
import { AboutDialog } from './Dialogs/AboutDialog';
import { ShortcutsDialog } from './Dialogs/ShortcutsDialog';

/** Renders every modal/dialog. Each component reads the active modal from the
 *  UI context and renders itself only when it is the active one. */
export function ModalRoot() {
  return (
    <>
      <SettingsModal />
      <DevToolsPanel />
      <FindReplace />
      <InsertTable />
      <InsertLink />
      <InsertImage />
      <SymbolPicker />
      <EquationDialog />
      <AboutDialog />
      <ShortcutsDialog />
    </>
  );
}
