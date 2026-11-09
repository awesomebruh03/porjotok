// DOM translation engine.
//
// Walks rendered text nodes (and a few user-visible attributes), translates the
// Bangla strings through the cache/Translator client, and can restore the
// original Bangla at any time. A MutationObserver re-applies translations when
// Svelte re-renders a route while English is active.
import {
  getTranslation,
  hasTranslation,
} from './cache.js';
import {
  hasActivation,
  isReady,
  translateMany,
  translateText,
} from './client.svelte.js';

const BENGALI = /[\u0980-\u09FF]/;
const TRANSLATABLE_ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];
const SKIP_SELECTOR =
  'script,style,noscript,code,pre,textarea,kbd,samp,[data-no-translate],[translate="no"]';

export const engine = $state({
  active: false,
  suspended: false,
  running: false,
  done: 0,
  total: 0,
  missing: 0,
});

let observer = null;
let generation = 0;
let scheduled = false;
let dirty = false;

const textOriginals = new WeakMap(); // Text node -> original raw value
const attrOriginals = new Map(); // Element -> Map(attribute -> original raw value)

let activationRequiredHandler = null;

// Registered by the locale controller: tells the UI that this page has strings
// that need a click before the model can translate them.
export function setActivationRequiredHandler(handler) {
  activationRequiredHandler = handler;
}

function isSkipped(element) {
  return !element || !!element.closest(SKIP_SELECTOR);
}

function splitWhitespace(raw) {
  const lead = raw.match(/^\s*/)[0];
  const trail = raw.match(/\s*$/)[0];
  return { lead, trail, source: raw.slice(lead.length, raw.length - trail.length) };
}

function collect(root) {
  const items = [];
  if (typeof document === 'undefined') return items;
  const start = root?.nodeType === Node.TEXT_NODE ? root.parentElement : root;
  if (!start || !start.isConnected) return items;

  const walker = document.createTreeWalker(
    start,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return isSkipped(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
        const parent = node.parentElement;
        if (!parent || isSkipped(parent)) return NodeFilter.FILTER_REJECT;
        const raw = node.nodeValue;
        if (!raw || !BENGALI.test(raw)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.nodeValue;
      const { lead, trail, source } = splitWhitespace(raw);
      if (source && BENGALI.test(source)) {
        items.push({ kind: 'text', node, raw, lead, trail, source });
      }
    } else {
      for (const attr of TRANSLATABLE_ATTRS) {
        const raw = node.getAttribute(attr);
        if (!raw || !BENGALI.test(raw)) continue;
        const { lead, trail, source } = splitWhitespace(raw);
        if (source) items.push({ kind: 'attr', el: node, attr, raw, lead, trail, source });
      }
    }
    node = walker.nextNode();
  }

  return items;
}

function apply(item, translated) {
  if (!translated || !BENGALI.test(item.source)) return false;

  if (item.kind === 'text') {
    if (!item.node.isConnected || item.node.nodeValue !== item.raw) return false;
    textOriginals.set(item.node, item.raw);
    item.node.nodeValue = item.lead + translated + item.trail;
    return true;
  }

  if (!item.el.isConnected || item.el.getAttribute(item.attr) !== item.raw) return false;
  let map = attrOriginals.get(item.el);
  if (!map) {
    map = new Map();
    attrOriginals.set(item.el, map);
  }
  if (!map.has(item.attr)) map.set(item.attr, item.raw);
  item.el.setAttribute(item.attr, item.lead + translated + item.trail);
  return true;
}

function applyFromCache(items, { requireComplete = false } = {}) {
  let missing = 0;
  const applied = [];

  // Decide first so requireComplete never leaves a half-English page.
  const resolved = items.map((item) => {
    const cached = getTranslation(item.source);
    if (cached == null) missing++;
    return { item, cached };
  });

  if (requireComplete && missing > 0) return { applied: 0, missing };

  for (const { item, cached } of resolved) {
    if (cached != null && apply(item, cached)) applied.push(item);
  }
  return { applied: applied.length, missing };
}

// Apply whatever is already cached. Used for instant, gesture-free English on
// reload when the cache is warm.
export function applyCachedTranslations(options = {}) {
  return applyFromCache(collect(document.body), options);
}

// Translate the current page. With commitAll the page swaps to English in one
// step (used for the first activation); otherwise each node updates as its
// translation lands (used for route changes and late renders).
export async function translatePage({ commitAll = true } = {}) {
  const gen = generation;
  const items = collect(document.body);
  if (items.length === 0) return { applied: 0, missing: 0 };

  const sourceSet = new Set(items.map((item) => item.source));
  const missing = [...sourceSet].filter((source) => !hasTranslation(source));

  engine.total = sourceSet.size;
  engine.done = sourceSet.size - missing.length;
  engine.missing = missing.length;

  if (missing.length === 0) {
    const applied = applyFromCache(items).applied;
    return { applied, missing: 0 };
  }

  // Without a user gesture (or a ready model) we can only use the cache.
  if (!isReady() && !hasActivation()) {
    if (missing.length > 0) activationRequiredHandler?.(true);
    return { applied: 0, missing: missing.length };
  }

  const bySource = new Map();
  for (const item of items) {
    if (!bySource.has(item.source)) bySource.set(item.source, []);
    bySource.get(item.source).push(item);
  }

  const pendingResults = new Map();

  const applySource = (source, translated) => {
    const list = bySource.get(source);
    if (!list) return;
    for (const item of list) apply(item, translated);
  };

  if (commitAll) {
    // Buffer everything, then swap the page once, so no mixed-language frame.
    await translateMany([...sourceSet], (source, translated, done, total) => {
      pendingResults.set(source, translated);
      if (done != null && gen === generation) {
        engine.done = done;
        engine.total = total;
      }
    });
    if (gen !== generation) return { applied: 0, missing: 0 };
    let applied = 0;
    for (const [source, translated] of pendingResults) {
      if (translated != null) {
        applySource(source, translated);
        applied++;
      }
    }
    activationRequiredHandler?.(false);
    return { applied, missing: 0 };
  }

  await translateMany([...sourceSet], (source, translated, done) => {
    if (gen !== generation) return;
    if (translated != null) applySource(source, translated);
    if (done != null) engine.done = done;
  });

  if (gen === generation) activationRequiredHandler?.(false);
  return { applied: sourceSet.size, missing: 0 };
}

// Translate the document title (it lives in <head>, outside the engine root).
export async function translateTitle(originalTitle) {
  if (!originalTitle) return originalTitle;
  const cached = getTranslation(originalTitle);
  if (cached != null) return cached;
  if (!isReady() && !hasActivation()) return originalTitle;
  try {
    return await translateText(originalTitle);
  } catch {
    return originalTitle;
  }
}

function restoreOriginals() {
  if (typeof document === 'undefined' || !document.body) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const original = textOriginals.get(node);
    if (original != null) {
      node.nodeValue = original;
      textOriginals.delete(node);
    }
    node = walker.nextNode();
  }

  for (const [el, map] of attrOriginals) {
    if (!el.isConnected) continue;
    for (const [attr, original] of map) el.setAttribute(attr, original);
  }
  attrOriginals.clear();
}

// Fast, per-node pipeline for mutations that happen after activation.
async function runMutationScan() {
  if (engine.running) {
    dirty = true;
    return;
  }
  engine.running = true;
  const gen = generation;
  try {
    await translatePage({ commitAll: false });
  } catch (error) {
    console.warn('[translate] mutation scan failed', error);
  } finally {
    engine.running = false;
    if (gen === generation && dirty) {
      dirty = false;
      scheduleScan();
    }
  }
}

function scheduleScan() {
  if (!engine.active || engine.suspended || scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    if (!engine.active) return;
    runMutationScan();
  });
}

export function startObserver() {
  engine.active = true;
  if (typeof MutationObserver === 'undefined' || !document.body) return;
  if (!observer) {
    observer = new MutationObserver((mutations) => {
      // Our own text swaps arrive as characterData mutations; the retranslated
      // text contains no Bengali, so the next scan is a cheap no-op.
      if (mutations.length === 0) return;
      scheduleScan();
    });
  }
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATABLE_ATTRS,
  });
}

export function stopObserver() {
  generation++;
  engine.active = false;
  engine.running = false;
  dirty = false;
  if (observer) observer.disconnect();
  restoreOriginals();
}

export function bumpGeneration() {
  generation++;
}

// Ask the engine to re-scan the page immediately (e.g. after activation).
export function rescan() {
  if (engine.active) scheduleScan();
}
