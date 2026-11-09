// Persistent translation cache.
//
// Every translated source string is stored under its own key, so editing one
// Bangla field invalidates only that field. A version prefix lets us wipe the
// whole store when the schema changes.
import { cacheKey } from './hash.js';

const VERSION = 'v1';
const PREFIX = `porjotok_mt:${VERSION}:`;

const memory = new Map();
let storageAvailable = true;

function storage() {
  if (!storageAvailable) return null;
  try {
    return window.localStorage;
  } catch {
    storageAvailable = false;
    return null;
  }
}

function fullKey(text) {
  return PREFIX + cacheKey(text);
}

export function getTranslation(text) {
  if (!text) return null;
  const key = fullKey(text);
  if (memory.has(key)) return memory.get(key);
  const store = storage();
  if (!store) return null;
  let value = null;
  try {
    value = store.getItem(key);
  } catch {
    storageAvailable = false;
  }
  if (value != null) memory.set(key, value);
  return value;
}

export function setTranslation(text, translated) {
  if (!text || translated == null) return;
  const key = fullKey(text);
  memory.set(key, translated);
  const store = storage();
  if (!store) return;
  try {
    store.setItem(key, translated);
  } catch {
    // Quota exceeded: keep the in-memory copy for this session only.
    storageAvailable = false;
  }
}

export function hasTranslation(text) {
  return getTranslation(text) != null;
}

export function cacheStats() {
  const store = storage();
  let count = memory.size;
  if (store) {
    try {
      count = 0;
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (key && key.startsWith(PREFIX)) count++;
      }
    } catch {
      /* ignore */
    }
  }
  return { count, prefix: PREFIX, storageAvailable };
}

export function clearCache() {
  memory.clear();
  const store = storage();
  if (!store) return 0;
  let removed = 0;
  try {
    const keys = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (key && key.startsWith(PREFIX)) keys.push(key);
    }
    for (const key of keys) {
      store.removeItem(key);
      removed++;
    }
  } catch {
    /* ignore */
  }
  return removed;
}

// Ask the browser not to evict our cache under storage pressure.
export function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist) navigator.storage.persist();
  } catch {
    /* ignore */
  }
}
