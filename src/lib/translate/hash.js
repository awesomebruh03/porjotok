// Stable, dependency-free string hash used for cache keys.
// FNV-1a 32-bit, rendered in base 36.
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// Include the source length so two different strings with the same hash
// can never silently share a cache entry.
export function cacheKey(text) {
  return `${text.length.toString(36)}.${hashString(text)}`;
}
