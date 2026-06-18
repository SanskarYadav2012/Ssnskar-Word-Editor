/**
 * Dynamic loader for the optional Rust/WASM performance core.
 *
 * The crate in `wasm/` compiles (via `npm run wasm:build`) into
 * `src/wasm-pkg/sanskar_core.js`. That output is intentionally NOT committed,
 * so this loader imports it lazily and degrades gracefully to the pure-JS
 * implementation when the package has not been built. This keeps the web app
 * fully functional out of the box while still allowing the native accelerator
 * to be enabled in builds that ship it.
 */

export interface WasmAnalysisResult {
  words: number;
  characters: number;
  characters_no_spaces: number;
  sentences: number;
  paragraphs: number;
  reading_time_min: number;
}

export interface WasmAnalyzer {
  analyze: (text: string) => WasmAnalysisResult;
}

interface WasmModule {
  default?: (input?: unknown) => Promise<unknown>;
  analyze_text?: (text: string) => WasmAnalysisResult;
}

let loadPromise: Promise<WasmAnalyzer | null> | null = null;
let cached: WasmAnalyzer | null = null;

export function isWasmLoaded(): boolean {
  return cached !== null;
}

export async function getWasmAnalyzer(): Promise<WasmAnalyzer | null> {
  if (cached) return cached;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      // Built lazily by `npm run wasm:build`. The specifier is assembled at
      // runtime so the bundler leaves it as a true dynamic import instead of
      // failing to resolve a package that is absent in the default build.
      const specifier = ['..', 'wasm-pkg', 'sanskar_core.js'].join('/');
      const mod = (await import(/* @vite-ignore */ specifier)) as WasmModule;
      if (typeof mod.default === 'function') {
        await mod.default();
      }
      if (typeof mod.analyze_text === 'function') {
        const analyze = mod.analyze_text;
        cached = { analyze: (text: string) => analyze(text) };
        return cached;
      }
      return null;
    } catch {
      // Package not built / not available in this runtime — that is expected.
      return null;
    }
  })();

  return loadPromise;
}
