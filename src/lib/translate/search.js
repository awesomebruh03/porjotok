// Locale-aware search matching.
//
// Bangla source text always matches. Once a field has been translated (during
// the background warm), its cached English text is searched too, so an English
// query still finds Bangla content.
import { getTranslation } from './cache.js';

export function matchesFields(item, query, fields) {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  for (const field of fields) {
    const value = item[field];
    if (typeof value !== 'string' || !value) continue;

    const source = value.trim();
    if (source.toLowerCase().includes(q)) return true;

    const english = getTranslation(source);
    if (english && english.toLowerCase().includes(q)) return true;
  }

  return false;
}

export const ARTICLE_SEARCH_FIELDS = [
  'title',
  'subtitle',
  'excerpt',
  'author',
  'categoryLabel',
  'location',
];

export const PUBLICATION_SEARCH_FIELDS = ['title', 'subtitle', 'summary', 'period'];
