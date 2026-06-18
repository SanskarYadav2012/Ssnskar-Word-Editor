export interface FindOptions {
  matchCase: boolean;
  wholeWord: boolean;
}

const HIGHLIGHT_CLASS = 'find-highlight';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex(query: string, opts: FindOptions): RegExp | null {
  if (!query) return null;
  let pattern = escapeRegExp(query);
  if (opts.wholeWord) pattern = `\\b${pattern}\\b`;
  try {
    return new RegExp(pattern, opts.matchCase ? 'g' : 'gi');
  } catch {
    return null;
  }
}

/** Remove all highlight wrappers, restoring the original text nodes. */
export function clearHighlights(root: HTMLElement): void {
  const marks = root.querySelectorAll(`span.${HIGHLIGHT_CLASS}`);
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });
}

/** Highlight every match and return the list of created highlight elements. */
export function highlightMatches(
  root: HTMLElement,
  query: string,
  opts: FindOptions,
): HTMLElement[] {
  clearHighlights(root);
  const regex = buildRegex(query, opts);
  if (!regex) return [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  const created: HTMLElement[] = [];
  for (const textNode of textNodes) {
    const value = textNode.nodeValue ?? '';
    regex.lastIndex = 0;
    if (!regex.test(value)) continue;
    regex.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (start > lastIndex) {
        frag.appendChild(document.createTextNode(value.slice(lastIndex, start)));
      }
      const span = document.createElement('span');
      span.className = HIGHLIGHT_CLASS;
      span.textContent = match[0];
      frag.appendChild(span);
      created.push(span);
      lastIndex = end;
      if (match[0].length === 0) regex.lastIndex++;
    }
    if (lastIndex < value.length) {
      frag.appendChild(document.createTextNode(value.slice(lastIndex)));
    }
    textNode.parentNode?.replaceChild(frag, textNode);
  }

  return created;
}

export function focusMatch(matches: HTMLElement[], index: number): void {
  matches.forEach((m, i) => m.classList.toggle('current', i === index));
  const target = matches[index];
  if (target) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/** Replace the text of a single highlighted match. Returns the updated list. */
export function replaceMatch(
  root: HTMLElement,
  matches: HTMLElement[],
  index: number,
  replacement: string,
): void {
  const target = matches[index];
  if (!target) return;
  const textNode = document.createTextNode(replacement);
  target.replaceWith(textNode);
  root.normalize();
}

export function replaceAllMatches(matches: HTMLElement[], replacement: string): number {
  let count = 0;
  matches.forEach((mark) => {
    mark.replaceWith(document.createTextNode(replacement));
    count++;
  });
  return count;
}
