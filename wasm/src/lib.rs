//! Sanskar-Word-Editor performance core.
//!
//! Compiles to WebAssembly via `wasm-pack` and exposes a single `analyze_text`
//! function that returns document statistics. The JavaScript side
//! (`src/core/textAnalysis.ts`) prefers this accelerator for large documents
//! and falls back to an identical pure-JS implementation when it is absent.

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

const WORDS_PER_MINUTE: f64 = 200.0;

#[derive(Serialize, Deserialize)]
pub struct AnalysisResult {
    pub words: usize,
    pub characters: usize,
    pub characters_no_spaces: usize,
    pub sentences: usize,
    pub paragraphs: usize,
    pub reading_time_min: usize,
}

/// Analyze a block of plain text and return word/character/sentence counts.
#[wasm_bindgen]
pub fn analyze_text(text: &str) -> Result<JsValue, JsValue> {
    let normalized = text.replace('\u{00a0}', " ");

    let words = normalized.split_whitespace().count();
    let characters = normalized.chars().count();
    let characters_no_spaces = normalized.chars().filter(|c| !c.is_whitespace()).count();
    let sentences = normalized
        .chars()
        .filter(|c| matches!(c, '.' | '!' | '?' | '。' | '？' | '!'))
        .count();
    let paragraphs = normalized
        .split('\n')
        .filter(|p| !p.trim().is_empty())
        .count();
    let reading_time_min = if words == 0 {
        0
    } else {
        ((words as f64) / WORDS_PER_MINUTE).round().max(1.0) as usize
    };

    let result = AnalysisResult {
        words,
        characters,
        characters_no_spaces,
        sentences,
        paragraphs,
        reading_time_min,
    };

    serde_wasm_bindgen::to_value(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}
