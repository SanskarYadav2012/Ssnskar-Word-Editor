/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors driven by CSS variables (see src/index.css).
        app: {
          bg: 'var(--app-bg)',
          surface: 'var(--app-surface)',
          'surface-2': 'var(--app-surface-2)',
          border: 'var(--app-border)',
          text: 'var(--app-text)',
          muted: 'var(--app-muted)',
          accent: 'var(--app-accent)',
          'accent-strong': 'var(--app-accent-strong)',
          ribbon: 'var(--app-ribbon)',
          'ribbon-hover': 'var(--app-ribbon-hover)',
        },
        sanskar: {
          blue: '#0b3aa0',
          'blue-light': '#1d56d6',
          gold: '#d4af37',
          'gold-light': '#f3d98b',
          'gold-dark': '#9c7a1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        page: '0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
        ribbon: '0 1px 0 var(--app-border)',
        gold: '0 0 0 1px rgba(212,175,55,0.5), 0 8px 24px rgba(212,175,55,0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.16s ease-out',
        'scale-in': 'scale-in 0.14s ease-out',
      },
    },
  },
  plugins: [],
};
