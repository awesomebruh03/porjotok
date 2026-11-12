// Content layer consistency check.  Run with: npm run check:content
//
//  1. content/site.json is well formed (every entry has a string `bn`).
//  2. Every key used in src/ (t / link / hrefOf / <RichText key> /
//     data-content-key) exists in site.json.
//  3. No Bengali text is left hard-coded in .svelte files.
//     Intentional exceptions: put `content-ignore` on the same or the
//     previous line (use it for dynamic data, never for copy).
//
// Unused keys are reported as warnings only.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const BENGALI = /[\u0980-\u09FF]/;

const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// --- 1. site.json -----------------------------------------------------------
let content = {};
try {
  content = JSON.parse(readFileSync(join(root, 'content/site.json'), 'utf8'));
} catch (error) {
  errors.push(`content/site.json: ${error.message}`);
}

for (const [key, entry] of Object.entries(content)) {
  if (!/^[a-z0-9]+(\.[A-Za-z0-9_-]+)+$/.test(key)) {
    errors.push(`site.json: bad key "${key}" (use dotted ids like header.nav.publications)`);
  }
  if (typeof entry?.bn !== 'string' || entry.bn.trim() === '') {
    errors.push(`site.json: "${key}" has no bn text`);
  }
  if ('en' in entry && typeof entry.en !== 'string') {
    errors.push(`site.json: "${key}".en must be a string`);
  }
  if ('href' in entry && typeof entry.href !== 'string') {
    errors.push(`site.json: "${key}".href must be a string`);
  }
  if ('newTab' in entry && typeof entry.newTab !== 'boolean') {
    errors.push(`site.json: "${key}".newTab must be a boolean`);
  }
}

// --- 2. key usage -----------------------------------------------------------
const srcFiles = walk(join(root, 'src')).filter((f) => /\.(svelte|js)$/.test(f));
const used = new Map(); // key -> first "file:line"

function noteUse(key, file, text, index) {
  if (used.has(key)) return;
  const line = text.slice(0, index).split('\n').length;
  used.set(key, `${relative(root, file)}:${line}`);
}

const USE_PATTERNS = [
  /\b(?:t|link|hrefOf)\(\s*['"]([^'"`]+)['"]/g,
  /<RichText[^>]*?\bkey=["']([^"']+)["']/g,
  /data-content-key(?:-[a-z]+)?=["']([^"']+)["']/g,
];

for (const file of srcFiles) {
  if (file.endsWith('content.svelte.js')) continue;
  const text = readFileSync(file, 'utf8');
  for (const pattern of USE_PATTERNS) {
    for (const match of text.matchAll(pattern)) noteUse(match[1], file, text, match.index);
  }
}

for (const [key, where] of used) {
  if (!(key in content)) errors.push(`${where}: key "${key}" is not in site.json`);
}
for (const key of Object.keys(content)) {
  if (!used.has(key)) warnings.push(`site.json: "${key}" is never used in src/`);
}

// --- 3. hard-coded Bengali in .svelte files -----------------------------------
function stripComments(text) {
  // Keep line structure so reported line numbers stay correct.
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:'"`])\/\/[^\n]*/g, (m, p1) => p1 + blank(m.slice(p1.length)));
}

for (const file of srcFiles.filter((f) => f.endsWith('.svelte'))) {
  const raw = readFileSync(file, 'utf8').split('\n');
  const stripped = stripComments(raw.join('\n')).split('\n');
  stripped.forEach((line, i) => {
    if (!BENGALI.test(line)) return;
    if (raw[i].includes('content-ignore') || raw[i - 1]?.includes('content-ignore')) return;
    errors.push(`${relative(root, file)}:${i + 1}: hard-coded Bengali: ${line.trim().slice(0, 70)}`);
  });
}

// --- report -----------------------------------------------------------------
for (const w of warnings) console.warn(`warn   ${w}`);
for (const e of errors) console.error(`error  ${e}`);
console.log(
  `\n${Object.keys(content).length} keys, ${used.size} used, ${warnings.length} warnings, ${errors.length} errors`,
);
process.exit(errors.length ? 1 : 0);
