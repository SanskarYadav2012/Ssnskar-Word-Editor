import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sanskar.wordeditor',
  appName: 'Sanskar-Word-Editor',
  webDir: 'dist',
  backgroundColor: '#0b3aa0ff',
  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
