import type { AppSettings } from '@/types';

export const APP_NAME = 'Sanskar-Word-Editor';
export const APP_VERSION = '1.0.0';
export const COPYRIGHT = '© 2026 Copyright Sanskar. All rights reserved.';

export const FONT_FAMILIES: string[] = [
  'Calibri',
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Lora',
  'Garamond',
  'Cambria',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Courier New',
  'Roboto Mono',
  'Comic Sans MS',
  'Impact',
];

export const FONT_SIZES: number[] = [
  8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72,
];

export const LINE_SPACINGS: { label: string; value: number }[] = [
  { label: '1.0', value: 1 },
  { label: '1.15', value: 1.15 },
  { label: '1.5', value: 1.5 },
  { label: '2.0', value: 2 },
  { label: '2.5', value: 2.5 },
  { label: '3.0', value: 3 },
];

export const ZOOM_LEVELS: number[] = [50, 75, 90, 100, 110, 125, 150, 175, 200];

export const TEXT_COLORS: string[] = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#ffffff',
  '#e6194b', '#f58231', '#ffe119', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4',
  '#0b3aa0', '#1d56d6', '#d4af37', '#9c7a1e', '#800000', '#008080', '#000075',
];

export const HIGHLIGHT_COLORS: string[] = [
  '#ffff00', '#00ffff', '#00ff00', '#ff00ff', '#ffa500', '#ff6961',
  '#c1f0c1', '#cfe2ff', '#ffe066', '#e2c2ff', 'transparent',
];

export const LANGUAGES: { code: string; label: string }[] = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'ja-JP', label: 'Japanese' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultFontFamily: 'Calibri',
  defaultFontSize: 11,
  autoSaveEnabled: true,
  autoSaveIntervalSec: 30,
  spellCheckEnabled: true,
  showRuler: true,
  language: 'en-US',
  zoom: 100,
  pageSize: 'A4',
  margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
};

export interface SocialLink {
  label: string;
  href: string;
  display: string;
  kind: 'github' | 'twitter' | 'linkedin' | 'phone' | 'gmail' | 'support' | 'outlook';
}

/** Contact + social links — exactly as specified by Sanskar. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://www.github.com/SanskarYadav2012',
    display: 'SanskarYadav2012',
    kind: 'github',
  },
  {
    label: 'X (Twitter)',
    href: 'https://www.x.com/Sanskar1729',
    display: '@Sanskar1729',
    kind: 'twitter',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sanskar-yadav-99628b3b1/',
    display: 'sanskar-yadav',
    kind: 'linkedin',
  },
  {
    label: 'Call Sanskar',
    href: 'tel:+919935768461',
    display: '+91 9935768461',
    kind: 'phone',
  },
  {
    label: 'Gmail',
    href: 'mailto:sanskaryadavfrom2012to2026@gmail.com',
    display: 'sanskaryadavfrom2012to2026@gmail.com',
    kind: 'gmail',
  },
  {
    label: 'Contact Support',
    href: 'mailto:supportramsandesh@gmail.com',
    display: 'supportramsandesh@gmail.com',
    kind: 'support',
  },
  {
    label: 'Outlook',
    href: 'mailto:sanskaryadavfromghosimau2026-27@outlook.com',
    display: 'sanskaryadavfromghosimau2026-27@outlook.com',
    kind: 'outlook',
  },
];

export const KEYBOARD_SHORTCUTS: { keys: string; action: string }[] = [
  { keys: 'Ctrl + B', action: 'Bold' },
  { keys: 'Ctrl + I', action: 'Italic' },
  { keys: 'Ctrl + U', action: 'Underline' },
  { keys: 'Ctrl + Shift + X', action: 'Strikethrough' },
  { keys: 'Ctrl + Z', action: 'Undo' },
  { keys: 'Ctrl + Y', action: 'Redo' },
  { keys: 'Ctrl + F', action: 'Find & Replace' },
  { keys: 'Ctrl + S', action: 'Save (.sanskar)' },
  { keys: 'Ctrl + O', action: 'Open file' },
  { keys: 'Ctrl + P', action: 'Print / Export PDF' },
  { keys: 'Ctrl + K', action: 'Insert link' },
  { keys: 'Ctrl + =', action: 'Zoom in' },
  { keys: 'Ctrl + -', action: 'Zoom out' },
];
