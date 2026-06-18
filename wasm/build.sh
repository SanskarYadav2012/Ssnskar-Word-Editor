#!/usr/bin/env bash
# Build the Rust/WASM performance core into src/wasm-pkg/.
#
# Requirements:
#   - Rust toolchain (https://rustup.rs)
#   - wasm-pack    (cargo install wasm-pack)
#
# The generated package is intentionally git-ignored; the web app runs fully
# without it and transparently loads it when present.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/../src/wasm-pkg"

if ! command -v wasm-pack >/dev/null 2>&1; then
  echo "wasm-pack not found. Install it with: cargo install wasm-pack" >&2
  exit 1
fi

echo "Building Sanskar WASM core -> $OUT_DIR"
wasm-pack build "$SCRIPT_DIR" \
  --target web \
  --out-dir "$OUT_DIR" \
  --out-name sanskar_core \
  --release

echo "Done. The accelerator will be picked up automatically on next run."
