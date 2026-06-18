// Electron main process for Sanskar-Word-Editor.
// Loads the Vite dev server in development and the bundled build in production.
const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const isDev = process.env.ELECTRON_DEV === '1' || !app.isPackaged;
const DEV_URL = 'http://localhost:5173';

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 880,
    minHeight: 600,
    backgroundColor: '#0b3aa0',
    title: 'Sanskar-Word-Editor',
    icon: path.join(__dirname, '..', 'public', 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL(DEV_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Open external links in the user's default browser, not a new Electron window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('sanskar:open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Sanskar / Documents', extensions: ['sanskar', 'docx', 'txt', 'rtf', 'html', 'htm'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  if (canceled || filePaths.length === 0) return { canceled: true };
  const filePath = filePaths[0];
  const data = fs.readFileSync(filePath, 'utf8');
  return { canceled: false, path: filePath, name: path.basename(filePath), data };
});

ipcMain.handle('sanskar:save-file', async (_event, payload) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: payload.defaultPath,
    filters: payload.filters,
  });
  if (canceled || !filePath) return { canceled: true };
  const buffer =
    payload.encoding === 'base64'
      ? Buffer.from(payload.data, 'base64')
      : Buffer.from(payload.data, 'utf8');
  fs.writeFileSync(filePath, buffer);
  return { canceled: false, path: filePath };
});

ipcMain.handle('sanskar:get-versions', () => ({
  app: app.getVersion(),
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  node: process.versions.node,
  v8: process.versions.v8,
}));

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
