// Content layer consistency check.  Run with: npm run check:content
//
//  1. content/site.json and content/admin.json are well formed.
//  2. Every key used in src/ exists in the matching content file:
//     - public files -> content/site.json (t / link / hrefOf / <RichText key>
//       / data-content-key)
//     - src/lib/admin/ -> content/admin.json (at / data-admin-key / labelKey
//       and descriptionKey properties in the nav config)
//  3. No Bengali text is left hard-coded in .svelte files.
//     Intentional exceptions: put `content-ignore` on the same or the
//     previous line (use it for dynamic data, never for copy).
//
// Unused keys are reported as warnings only.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const BENGALI = /[\u0980-\u09FF]/;
const KEY_RE = /^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9_-]+)+$/;

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

function loadContent(file) {
  try {
    return JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
    return {};
  }
}

function validateContent(file, content, { requireEn = false } = {}) {
  for (const [key, entry] of Object.entries(content)) {
    if (!KEY_RE.test(key)) {
      errors.push(
        `${file}: bad key "${key}" (use dotted ids like header.nav.publications)`,
      );
    }
    if (typeof entry?.bn !== "string" || entry.bn.trim() === "") {
      errors.push(`${file}: "${key}" has no bn text`);
    }
    if (requireEn) {
      if (typeof entry?.en !== "string" || entry.en.trim() === "") {
        errors.push(`${file}: "${key}" has no en text`);
      }
    } else if ("en" in entry && typeof entry.en !== "string") {
      errors.push(`${file}: "${key}".en must be a string`);
    }
    if ("href" in entry && typeof entry.href !== "string") {
      errors.push(`${file}: "${key}".href must be a string`);
    }
    if ("newTab" in entry && typeof entry.newTab !== "boolean") {
      errors.push(`${file}: "${key}".newTab must be a boolean`);
    }
  }
}

// --- 1. content files -------------------------------------------------------
const content = loadContent("content/site.json");
const adminContent = loadContent("content/admin.json");
validateContent("content/site.json", content);
validateContent("content/admin.json", adminContent, { requireEn: true });

// --- 2. key usage -----------------------------------------------------------
const srcFiles = walk(join(root, "src")).filter((file) =>
  /\.(svelte|js)$/.test(file),
);

const isAdminFile = (file) =>
  relative(root, file).replaceAll("\\", "/").startsWith("src/lib/admin/");
const adminFiles = srcFiles.filter(isAdminFile);
const publicFiles = srcFiles.filter((file) => !isAdminFile(file));

function collectUsage(files, patterns, skip = () => false) {
  const used = new Map(); // key -> first "file:line"
  for (const file of files) {
    if (skip(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        const key = match[1];
        if (used.has(key)) continue;
        const line = text.slice(0, match.index).split("\n").length;
        used.set(key, `${relative(root, file)}:${line}`);
      }
    }
  }
  return used;
}

const PUBLIC_USE_PATTERNS = [
  /\b(?:t|link|hrefOf)\(\s*['"]([^'"`]+)['"]/g,
  /<RichText[^>]*?\bkey=["']([^"']+)["']/g,
  /data-content-key(?:-[a-z]+)?=["']([^"']+)["']/g,
];

const ADMIN_USE_PATTERNS = [
  /\bat\(\s*['"]([^'"`]+)['"]/g,
  /data-admin-key(?:-[a-z]+)?=["']([^"']+)["']/g,
  /\b(?:labelKey|descriptionKey):\s*["']([^"']+)["']/g,
];

const publicUsed = collectUsage(publicFiles, PUBLIC_USE_PATTERNS, (file) =>
  file.endsWith("content.svelte.js"),
);
const adminUsed = collectUsage(adminFiles, ADMIN_USE_PATTERNS);

for (const [key, where] of publicUsed) {
  if (!(key in content))
    errors.push(`${where}: key "${key}" is not in site.json`);
}
for (const key of Object.keys(content)) {
  if (!publicUsed.has(key))
    warnings.push(`site.json: "${key}" is never used in src/`);
}

for (const [key, where] of adminUsed) {
  if (!(key in adminContent))
    errors.push(`${where}: key "${key}" is not in admin.json`);
}
for (const key of Object.keys(adminContent)) {
  if (!adminUsed.has(key))
    warnings.push(`admin.json: "${key}" is never used in src/lib/admin/`);
}

// --- 3. hard-coded Bengali in .svelte files -----------------------------------
function stripComments(text) {
  // Keep line structure so reported line numbers stay correct.
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(
      /(^|[^:'"`])\/\/[^\n]*/g,
      (m, p1) => p1 + blank(m.slice(p1.length)),
    );
}

function checkBengali(files, target) {
  for (const file of files.filter((f) => f.endsWith(".svelte"))) {
    const raw = readFileSync(file, "utf8").split("\n");
    const stripped = stripComments(raw.join("\n")).split("\n");
    stripped.forEach((line, i) => {
      if (!BENGALI.test(line)) return;
      if (
        raw[i].includes("content-ignore") ||
        raw[i - 1]?.includes("content-ignore")
      )
        return;
      errors.push(
        `${relative(root, file)}:${i + 1}: hard-coded Bengali (${target}): ${line.trim().slice(0, 70)}`,
      );
    });
  }
}

checkBengali(publicFiles, "use content/site.json");
checkBengali(adminFiles, "use content/admin.json");

// --- report -----------------------------------------------------------------
for (const w of warnings) console.warn(`warn   ${w}`);
for (const e of errors) console.error(`error  ${e}`);
console.log(
  `\n${Object.keys(content).length} site keys, ${publicUsed.size} used | ` +
    `${Object.keys(adminContent).length} admin keys, ${adminUsed.size} used | ` +
    `${warnings.length} warnings, ${errors.length} errors`,
);
process.exit(errors.length ? 1 : 0);
