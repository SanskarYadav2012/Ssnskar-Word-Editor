import type { DocumentStats } from '@/types';
import { getWasmAnalyzer } from './wasmLoader';

const WORDS_PER_MINUTE = 200;

/** Pure-JS document statistics. Always correct; used as the default and as the
 *  fallback when the Rust/WASM accelerator is unavailable. */
export function analyzeTextJs(text: string): Omit<DocumentStats, 'pages'> {
  const trimmed = text.replace(/\u00a0/g, ' ');
  const words = (trimmed.match(/[^\s]+/g) ?? []).length;
  const characters = trimmed.length;
  const charactersNoSpaces = trimmed.replace(/\s/g, '').length;
  const sentences = (trimmed.match(/[^.!?。！？]+[.!?。！？]+/g) ?? []).length;
  const paragraphs = trimmed
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean).length;
  const readingTimeMin = words === 0 ? 0 : Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTimeMin };
}

/**
 * Analyze text, preferring the Rust/WASM accelerator when it has been built and
 * loaded. The WASM path is meaningfully faster for very large documents; the JS
 * path guarantees the app works everywhere with identical results.
 */
export async function analyzeText(
  text: string,
  preferWasm: boolean,
): Promise<{ stats: Omit<DocumentStats, 'pages'>; engine: 'wasm' | 'js' }> {
  if (preferWasm) {
    const wasm = await getWasmAnalyzer();
    if (wasm) {
      try {
        const r = wasm.analyze(text);
        return {
          stats: {
            words: r.words,
            characters: r.characters,
            charactersNoSpaces: r.characters_no_spaces,
            sentences: r.sentences,
            paragraphs: r.paragraphs,
            readingTimeMin: r.reading_time_min,
          },
          engine: 'wasm',
        };
      } catch {
        /* fall through to JS */
      }
    }
  }
  return { stats: analyzeTextJs(text), engine: 'js' };
}

export function extractPlainText(root: HTMLElement | null): string {
  if (!root) return '';
  return (root.innerText ?? root.textContent ?? '').trim();
}
