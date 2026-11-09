// Chrome/Edge on-device Translator API client.
//
// - Creates (and downloads) the bn → en model once per browser profile.
// - Serialises translation requests through a single queue.
// - Every result is cached, so repeat visits and page changes need no API call.
import { getTranslation, setTranslation, requestPersistentStorage } from './cache.js';

const SOURCE_LANG = 'bn';
const TARGET_LANG = 'en';
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const MODEL_FLAG = 'porjotok_mt:model';

// Reactive status read by the header button / progress panel.
export const translator = $state({
  status: 'idle', // idle | checking | downloading | ready | unsupported | error | blocked
  download: 0, // 0-100, -1 when unknown
  error: null,
});

let instance = null;
let creating = null;
let queue = Promise.resolve();
let activated = false;

export function isSupported() {
  return typeof window !== 'undefined' && 'Translator' in window;
}

export function isReady() {
  return instance != null;
}

// True once a real user gesture has unlocked model creation. Needed to decide
// whether the engine may call the API at all (cache reads are always allowed).
export function hasActivation() {
  return activated;
}

export function markActivation() {
  activated = true;
}

// Set after the model has been downloaded at least once. Lets a later page
// load try to recreate it without a fresh gesture (Chrome may allow this when
// no download is needed).
export function hasModelFlag() {
  try {
    return window.localStorage.getItem(MODEL_FLAG) === '1';
  } catch {
    return false;
  }
}

function markModelReady() {
  try {
    window.localStorage.setItem(MODEL_FLAG, '1');
  } catch {
    /* ignore */
  }
}

export function bengaliToAsciiDigits(text) {
  return text.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

function postProcess(text) {
  // English output sometimes keeps Bengali numerals (e.g. "Issue ৩৮").
  return bengaliToAsciiDigits(text);
}

export async function ensureTranslator() {
  if (instance) return instance;
  if (!isSupported()) {
    translator.status = 'unsupported';
    throw new Error('The on-device Translator API is not available in this browser.');
  }
  if (creating) return creating;

  translator.status = 'checking';
  translator.error = null;

  creating = (async () => {
    const pair = { sourceLanguage: SOURCE_LANG, targetLanguage: TARGET_LANG };

    let availability = 'downloadable';
    try {
      availability = await Translator.availability(pair);
    } catch {
      /* older builds may not expose availability(); try create() anyway */
    }

    if (availability === 'unavailable') {
      translator.status = 'unsupported';
      throw new Error('Bengali to English translation is not available on this device.');
    }

    const options = {
      ...pair,
      monitor(m) {
        m.addEventListener('downloadprogress', (event) => {
          const loaded = typeof event.loaded === 'number' ? event.loaded : 0;
          translator.download = Math.round(loaded * 100);
          translator.status = 'downloading';
        });
      },
    };

    instance = await Translator.create(options);
    translator.status = 'ready';
    translator.download = 100;
    markModelReady();
    requestPersistentStorage();
    return instance;
  })();

  try {
    return await creating;
  } catch (error) {
    creating = null;
    instance = null;
    if (error?.name === 'NotAllowedError') {
      translator.status = 'blocked';
      translator.error = 'English needs one click to start. Press the translate button again.';
    } else {
      translator.status = 'error';
      translator.error = error?.message || 'Could not start the on-device translator.';
    }
    throw error;
  } finally {
    creating = null;
  }
}

// Translate a single string through the cache + serial queue.
export async function translateText(text) {
  if (!text || !text.trim()) return text;

  const cached = getTranslation(text);
  if (cached != null) return cached;

  const api = await ensureTranslator();

  queue = queue.then(async () => {
    const again = getTranslation(text);
    if (again != null) return again;
    const output = await api.translate(text);
    setTranslation(text, postProcess(output));
  });

  await queue;
  return getTranslation(text) ?? text;
}

// Translate many strings with bounded concurrency, calling onResult as each
// one lands.
export async function translateMany(texts, onResult) {
  const unique = [...new Set(texts)];
  const missing = unique.filter((text) => getTranslation(text) == null);

  translator.status = 'ready';

  if (onResult) {
    for (const text of unique) {
      if (getTranslation(text) != null) onResult(text, getTranslation(text));
    }
  }

  if (missing.length === 0) return;

  const api = await ensureTranslator();

  // Bounded concurrency: short UI strings finish much faster than a strict
  // one-at-a-time loop, while still keeping memory and API pressure low.
  const CONCURRENCY = 3;
  let next = 0;
  let finished = unique.length - missing.length;

  async function worker() {
    while (true) {
      const index = next++;
      if (index >= missing.length) return;
      const text = missing[index];
      let output = getTranslation(text);
      if (output == null) {
        output = postProcess(await api.translate(text));
        setTranslation(text, output);
      }
      finished++;
      if (onResult) onResult(text, output, finished, unique.length);
    }
  }

  const workers = Array.from(
    { length: Math.min(CONCURRENCY, missing.length) },
    () => worker(),
  );
  await Promise.all(workers);
}
