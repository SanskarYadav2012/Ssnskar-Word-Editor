// Preload script — exposes a minimal, safe desktop API to the renderer.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sanskarDesktop', {
  isDesktop: true,
  platform: process.platform,
  openFile: () => ipcRenderer.invoke('sanskar:open-file'),
  saveFile: (payload) => ipcRenderer.invoke('sanskar:save-file', payload),
  getVersions: () => ipcRenderer.invoke('sanskar:get-versions'),
});
