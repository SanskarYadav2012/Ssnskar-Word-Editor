/// <reference types="vite/client" />

interface SanskarDesktopApi {
  readonly isDesktop: true;
  readonly platform: NodeJS.Platform | string;
  openFile: () => Promise<{ canceled: boolean; path?: string; name?: string; data?: string } | null>;
  saveFile: (payload: {
    defaultPath?: string;
    filters?: { name: string; extensions: string[] }[];
    data: string;
    encoding?: 'utf8' | 'base64';
  }) => Promise<{ canceled: boolean; path?: string } | null>;
  getVersions: () => Record<string, string>;
}

interface Window {
  sanskarDesktop?: SanskarDesktopApi;
}
