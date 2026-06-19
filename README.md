<div align="center">
  <img src="public/logo.png" alt="Sanskar-Word-Editor" width="120" />

  # Sanskar-Word-Editor

  **A premium, cross-platform word processor — React + TypeScript + Vite, with Electron desktop builds, Capacitor Android builds, and an optional Rust/WASM performance core.**

  © 2026 Copyright Sanskar. All rights reserved.
</div>

---

## ✨ Features

- **Rich text formatting** — bold, italic, underline, strikethrough, subscript, superscript.
- **Typography** — font family & size, text color, highlight color, line spacing, headings & paragraph styles.
- **Paragraph & layout** — left/center/right/justify alignment, bulleted / numbered / multi-level lists, indentation, page size (A4 / Letter / Legal) and margins.
- **Insertions** — tables (visual grid picker), images, hyperlinks, symbols/equations, code blocks, editable headers & footers, page numbers.
- **Tools** — find & replace (match case / whole word), live word & character count, undo / redo, auto-save with crash recovery, spell-check toggle.
- **File support** — open `.sanskar`, `.docx`, `.txt`, `.rtf`, `.html`; export to all of those plus `.pdf`. `.sanskar` is a self-describing JSON format that round-trips content + settings.
- **Ribbon UI** — Home, Insert, Layout, References, Review, View tabs, just like industry-leading editors.
- **Document canvas** — paginated A4 paper view with page-break guides, zoom (25%–300%), running header/footer zones.
- **Themes** — Light, Dark, System and **Premium Gold**.
- **Settings** — default fonts, auto-save interval, language, spell-check, ruler, keyboard shortcuts.
- **Developer Options** — hidden menu (click the version number **7 times** in the status bar) with a live DOM inspector, performance monitor (JS heap / FPS / DOM nodes), debug console + log viewer, and experimental feature-flag toggles.
- **Contact sidebar** — "Follow Sanskar on:-" with all of Sanskar's links.

---

## 🧱 Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 18 · TypeScript 5 · TailwindCSS 3 |
| Bundler | Vite 5 |
| Desktop | Electron 33 + electron-builder (`.exe`, `.dmg`/`.app`, `AppImage`) |
| Mobile | Capacitor 6 (Android `.apk`) |
| Performance core | Rust → WebAssembly (`wasm-pack`), with a pure-JS fallback |
| File I/O | `mammoth` (DOCX import), `fflate` (DOCX export via `altChunk`), `jsPDF` + `html2canvas` (PDF), `file-saver` |

---

## 📂 Directory Structure

```
Sanskar-Word-Editor/
├─ public/
│  └─ logo.png                     # App icon / favicon
├─ build/
│  └─ icon.png                     # electron-builder app icon
├─ electron/
│  ├─ main.cjs                     # Electron main process (window, IPC, file dialogs)
│  └─ preload.cjs                  # Safe contextBridge API (window.sanskarDesktop)
├─ wasm/
│  ├─ Cargo.toml                   # Rust crate manifest
│  ├─ src/lib.rs                   # analyze_text() — fast document statistics
│  └─ build.sh                     # wasm-pack build → src/wasm-pkg/
├─ src/
│  ├─ main.tsx                     # React entry point
│  ├─ App.tsx                      # Providers + app shell layout
│  ├─ index.css                    # Tailwind layers + theme CSS variables
│  ├─ types/                       # Shared TypeScript types & constants
│  ├─ context/
│  │  ├─ SettingsContext.tsx       # Theme, fonts, autosave, zoom, page setup
│  │  ├─ EditorContext.tsx         # Content, selection, format state, commands, stats
│  │  ├─ UIContext.tsx             # Active ribbon tab, modals, toasts, sidebar
│  │  └─ DevContext.tsx            # 7-click unlock, feature flags, logs
│  ├─ core/
│  │  ├─ editorCommands.ts         # execCommand wrappers / command layer
│  │  ├─ fileIO.ts                 # Import & export for every supported format
│  │  ├─ docx.ts                   # Self-contained .docx (OOXML altChunk) writer
│  │  ├─ findReplace.ts            # Find & replace engine with highlighting
│  │  ├─ textAnalysis.ts           # Word/char/sentence stats (WASM-preferred)
│  │  └─ wasmLoader.ts             # Lazy, graceful Rust/WASM loader
│  ├─ hooks/
│  │  ├─ useFileActions.ts         # New / Open / Save / Export / Print
│  │  ├─ useKeyboardShortcuts.ts   # Ctrl+S / Ctrl+O / Ctrl+P / Ctrl+F …
│  │  ├─ useAutoSave.ts            # Interval autosave + crash recovery
│  │  └─ usePerformanceMonitor.ts  # Heap / FPS / DOM-node sampling
│  ├─ components/
│  │  ├─ Ribbon/                   # TopBar + Ribbon + 6 tab panels
│  │  ├─ Editor/                   # DocumentCanvas (A4 pages) + EditorSurface
│  │  ├─ Sidebar/SocialSidebar.tsx # "Follow Sanskar on:-"
│  │  ├─ StatusBar/StatusBar.tsx   # Pages, words, zoom, version, copyright
│  │  ├─ Settings/SettingsModal.tsx
│  │  ├─ DevTools/DevToolsPanel.tsx
│  │  ├─ Dialogs/                  # Find/Replace, Table, Link, Image, Symbol, Equation, About, Shortcuts
│  │  ├─ ModalRoot.tsx             # Renders all dialogs
│  │  └─ common/                   # Modal, Popover, RibbonButton/Group, ColorGrid, Toast
│  └─ utils/                       # constants, logger, storage
├─ capacitor.config.ts             # Capacitor (Android) configuration
├─ vite.config.ts                  # base: './' for cross-platform asset loading
├─ tailwind.config.js · postcss.config.js · .eslintrc.cjs
├─ tsconfig*.json
└─ package.json                    # Dependencies + all build scripts (build.* = electron-builder)
```

---

## 🚀 Getting Started

> Requirements: **Node.js ≥ 18** and **npm**. (Desktop icon tooling, Rust, and Android SDK are only needed for their respective build targets.)

```bash
# 1. Install dependencies
npm install

# 2. Run the web app in development (http://localhost:5173)
npm run dev

# 3. Production web build → dist/
npm run build:web
npm run preview          # serve the production build locally
```

### Quality gates

```bash
npm run lint             # ESLint (zero warnings allowed)
npm run typecheck        # TypeScript strict, project-references build
```

---

## 🖥️ Desktop builds (Electron → .exe / .dmg / .app / AppImage)

```bash
# Develop the desktop shell with hot reload
npm run electron:dev

# Build installers for the current OS (output → release/)
npm run electron:build

# Or target a specific platform:
npm run electron:build:win     # Windows  → NSIS installer (.exe) + portable .exe
npm run electron:build:mac     # macOS    → .dmg + .zip (.app inside)
npm run electron:build:linux   # Linux    → AppImage + .deb
```

> **Cross-compilation note:** electron-builder builds Windows targets best on Windows (or via Wine/Docker), and macOS targets must be built on macOS due to Apple code-signing/`dmg` tooling. Building each target on its native OS (or in CI runners per-OS) is recommended. Output installers land in `release/`.

---

## 📱 Android build (Capacitor → .apk)

```bash
# One-time: add the native Android project
npm run cap:add:android

# Build the web assets and sync them into the Android project
npm run cap:sync

# Build a debug APK (output: android/app/build/outputs/apk/debug/app-debug.apk)
npm run android:build

# Release (unsigned) APK
npm run android:build:release
```

> Requires Android Studio / Android SDK and a JDK. After `cap:add:android`, open `android/` in Android Studio to configure signing for a release build, or sign the generated APK with `apksigner`.

---

## ⚙️ Optional: Rust/WASM performance core

The editor ships a pure-JavaScript text-analysis engine and works fully without any native code. To enable the faster Rust/WASM accelerator:

```bash
# Requires Rust (https://rustup.rs) and wasm-pack (cargo install wasm-pack)
npm run wasm:build       # compiles wasm/ → src/wasm-pkg/ (git-ignored)
```

Once built, `src/core/wasmLoader.ts` picks it up automatically on the next run; the status bar will report **WASM** instead of **JS** as the active analysis engine.

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
| --- | --- |
| Save (`.sanskar`) | `Ctrl/⌘ + S` |
| Open | `Ctrl/⌘ + O` |
| Print / PDF | `Ctrl/⌘ + P` |
| Find & Replace | `Ctrl/⌘ + F` |
| Bold / Italic / Underline | `Ctrl/⌘ + B` / `I` / `U` |
| Undo / Redo | `Ctrl/⌘ + Z` / `Ctrl/⌘ + Y` |

---

## 📬 Follow Sanskar

- **GitHub:** https://www.github.com/Sanskar-in
- **X (Twitter):** https://www.x.com/Sanskar1729
- **LinkedIn:** https://www.linkedin.com/in/sanskar-yadav-in/
- **Call:** +91 9935768461
- **Gmail:** sanskaryadavfrom2012to2026@gmail.com
- **Support:** supportramsandesh@gmail.com
- **Outlook:** sanskaryadavfromghosimau2026-27@outlook.com

---

## 📄 License

MIT © 2026 Sanskar. All rights reserved.
