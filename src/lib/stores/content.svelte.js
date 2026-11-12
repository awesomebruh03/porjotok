// Content layer: every piece of public copy lives in content/site.json,
// keyed by a stable id such as `header.nav.publications`.
//
//   { "<key>": { "bn": "...", "en": "", "href": "#/publications", "newTab": false } }
//
// - `bn` is the default text, `en` is optional (empty falls back to `bn`; the
//   on-device translator still handles English until `en` is filled in).
// - `href` / `newTab` exist only on entries that render as links.
// - `{name}` placeholders in a string are filled from the `vars` argument.
//
// Overrides (published edits, or the editor draft) are layered on top of the
// bundled baseline, so the site keeps working when no remote content loads.
import baseContent from '../../../content/site.json';
import { locale } from '../translate/locale.svelte.js';

let overrides = $state({});

const warned = new Set();

function entry(key) {
  const base = baseContent[key];
  const over = overrides[key];
  if (!base && !over) {
    if (import.meta.env.DEV && !warned.has(key)) {
      warned.add(key);
      console.warn(`[content] missing key "${key}"`);
    }
    return null;
  }
  return over ? { ...base, ...over } : base;
}

function fill(text, vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

// Text for a key, in the active language.
export function t(key, vars) {
  const e = entry(key);
  if (!e) return '';
  const text = locale.value === 'en' && e.en ? e.en : (e.bn ?? '');
  return fill(text, vars);
}

// Props to spread onto an <a>: <a {...link('footer.about')}>{t('footer.about')}</a>
export function link(key) {
  const e = entry(key);
  const props = { href: e?.href ?? '', 'data-content-key': key };
  if (e?.newTab) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return props;
}

// Raw href for a key (for code that navigates programmatically).
export function hrefOf(key) {
  return entry(key)?.href ?? '';
}

// Replace the override layer (remote published content, or an editor draft).
export function setContentOverrides(map) {
  overrides = map && typeof map === 'object' ? map : {};
}

export function getContentOverrides() {
  return overrides;
}

export function getBaseContent() {
  return baseContent;
}
