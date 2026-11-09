// Locale controller: বাংলা (default) ⇄ English (on-device, cached).
import { getTranslation, hasTranslation } from './cache.js';
import {
  ensureTranslator,
  hasModelFlag,
  isReady,
  markActivation,
  translator,
} from './client.svelte.js';
import {
  applyCachedTranslations,
  bumpGeneration,
  engine,
  rescan,
  setActivationRequiredHandler,
  startObserver,
  stopObserver,
  translatePage,
  translateTitle,
} from './engine.svelte.js';
import { prewarmTranslations } from './prewarm.svelte.js';

const STORAGE_KEY = 'porjotok_locale';
const BENGALI = /[\u0980-\u09FF]/;

export const locale = $state({
  value: 'bn', // 'bn' | 'en'
  busy: false,
  pendingEnglish: false, // browser prefers English but the cache is cold
  needsActivation: false, // English is on, but this page has uncached strings
  initialized: false,
});

setActivationRequiredHandler((required) => {
  if (required) {
    if (locale.value === 'en' && !isReady()) locale.needsActivation = true;
  } else {
    locale.needsActivation = false;
  }
});

let originalTitle = '';
let opToken = 0;

function persist(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

function readSaved() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function browserPrefersEnglish() {
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || 'en'];
  return !languages[0].toLowerCase().startsWith('bn');
}

function applyDocumentLanguage(value) {
  document.documentElement.lang = value === 'en' ? 'en' : 'bn';
}

async function applyEnglishDocument() {
  const translatedTitle = await translateTitle(originalTitle);
  if (translatedTitle && !BENGALI.test(translatedTitle)) {
    document.title = translatedTitle;
  }
}

// Called once from App.svelte after mount.
export async function initLocale() {
  if (locale.initialized) return;
  locale.initialized = true;
  originalTitle = document.title;

  const saved = readSaved();
  const wantsEnglish = saved === 'en' || (saved == null && browserPrefersEnglish());
  if (!wantsEnglish) {
    applyDocumentLanguage('bn');
    return;
  }

  // Warm cache: switch instantly, no gesture or network needed.
  const { missing } = applyCachedTranslations({ requireComplete: true });
  const titleReady = !BENGALI.test(originalTitle) || hasTranslation(originalTitle);

  if (missing === 0 && titleReady) {
    locale.value = 'en';
    applyDocumentLanguage('en');
    await applyEnglishDocument();
    startObserver();

    // The model was downloaded in an earlier session. Try to recreate it with
    // no fresh gesture so pages that were never opened can still be translated.
    if (hasModelFlag()) {
      ensureTranslator()
        .then(() => rescan())
        .catch(() => {
          translator.status = 'idle';
          translator.error = null;
        });
    }
    return;
  }

  // Cold cache: show Bangla now, highlight the header button.
  locale.pendingEnglish = true;
  applyDocumentLanguage('bn');
}

// User pressed the header button (this is the gesture the API requires).
export async function enableEnglish() {
  if (locale.busy) return;
  if (locale.value === 'en' && !locale.needsActivation) return;

  const token = ++opToken;
  locale.busy = true;
  engine.suspended = true;
  translator.error = null;
  markActivation();

  try {
    await ensureTranslator();
    if (token !== opToken) return;

    await translatePage({ commitAll: true });
    if (token !== opToken) return;

    locale.value = 'en';
    locale.pendingEnglish = false;
    locale.needsActivation = false;
    applyDocumentLanguage('en');
    persist('en');
    await applyEnglishDocument();

    startObserver();
    rescan();
    prewarmTranslations();
  } catch (error) {
    if (token === opToken) {
      locale.busy = false;
      console.warn('[translate] could not enable English', error);
    }
  } finally {
    engine.suspended = false;
    if (token === opToken) locale.busy = false;
  }
}

export function disableEnglish() {
  opToken++;
  locale.busy = false;
  locale.pendingEnglish = false;
  locale.needsActivation = false;
  stopObserver(); // restores Bangla text + bumps the generation token
  locale.value = 'bn';
  applyDocumentLanguage('bn');
  if (originalTitle) document.title = originalTitle;
  persist('bn');
}

export function cancelTranslation() {
  opToken++;
  locale.busy = false;
  bumpGeneration(); // discard any in-flight page swap
  translator.status = 'idle';
  if (locale.value === 'bn') persist('bn');
}

export async function toggleLocale() {
  if (locale.busy) {
    cancelTranslation();
    return;
  }
  if (locale.value === 'en' && !locale.needsActivation) {
    disableEnglish();
    return;
  }
  await enableEnglish();
}

export function retryEnglish() {
  translator.status = 'idle';
  translator.error = null;
  enableEnglish();
}

export function isEnglish() {
  return locale.value === 'en';
}
