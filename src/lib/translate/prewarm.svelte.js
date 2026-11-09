// Background warming: translate every string in the content files once, so
// later page visits are instant cache hits. Runs only after the user has
// activated English and the model is ready.
import { hasTranslation } from './cache.js';
import { isReady, translateMany } from './client.svelte.js';

const BENGALI = /[\u0980-\u09FF]/;

export const warm = $state({
  running: false,
  done: 0,
  total: 0,
});

let started = false;

function collectStrings(value, out) {
  if (typeof value === 'string') {
    // Article bodies are rendered paragraph by paragraph; warm the same units.
    for (const part of value.split('\n\n')) {
      const core = part.replace(/^##\s+/, '').replace(/^>\s+/, '').trim();
      if (core.length > 1 && BENGALI.test(core)) out.add(core);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) collectStrings(entry, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectStrings(entry, out);
  }
}

export async function prewarmTranslations() {
  if (started || !isReady()) return;
  started = true;

  try {
    const [{ articles }, { publications }, { categories }] = await Promise.all([
      import('../data/articles.js'),
      import('../data/publications.js'),
      import('../data/categories.js'),
    ]);

    const strings = new Set();
    collectStrings(articles, strings);
    collectStrings(publications, strings);
    collectStrings(categories, strings);
    if (BENGALI.test(document.title)) strings.add(document.title.trim());

    const list = [...strings];
    warm.total = list.length;
    warm.done = list.filter((text) => hasTranslation(text)).length;

    if (list.length === 0) return;

    warm.running = true;
    await translateMany(list, (text, translated, done, total) => {
      if (done != null) {
        warm.done = done;
        warm.total = total;
      }
    });
  } catch (error) {
    console.warn('[translate] background warm failed', error);
  } finally {
    warm.running = false;
  }
}

export function resetWarmState() {
  started = false;
  warm.running = false;
  warm.done = 0;
  warm.total = 0;
}
