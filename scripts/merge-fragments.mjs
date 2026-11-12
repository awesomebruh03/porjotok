// Merge content/fragments/*.json into content/site.json (keys sorted),
// failing on duplicate keys. Used while building the content layer.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = join(root, 'content/fragments');
const sitePath = join(root, 'content/site.json');

const site = JSON.parse(readFileSync(sitePath, 'utf8'));
let added = 0;
let failed = false;

for (const name of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const fragment = JSON.parse(readFileSync(join(dir, name), 'utf8'));
  for (const [key, entry] of Object.entries(fragment)) {
    if (key in site) {
      console.error(`duplicate key "${key}" (${name})`);
      failed = true;
      continue;
    }
    site[key] = entry;
    added++;
  }
}

if (failed) process.exit(1);

const sorted = Object.fromEntries(Object.keys(site).sort().map((k) => [k, site[k]]));
writeFileSync(sitePath, JSON.stringify(sorted, null, 2) + '\n');
console.log(`merged ${added} keys, ${Object.keys(sorted).length} total`);
