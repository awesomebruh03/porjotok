// Helper to parse route and params
function parseRoute(hash) {
  const clean = hash.replace(/^#\/?/, '').trim();
  const [pathStr, queryString] = clean.split('?');
  const segments = pathStr ? pathStr.split('/') : [];

  const query = {};
  if (queryString) {
    const params = new URLSearchParams(queryString);
    for (const [k, v] of params.entries()) {
      query[k] = v;
    }
  }

  // Route matching
  if (segments.length === 0 || segments[0] === '') {
    return { name: 'home', path: '/', params: {}, query };
  }

  if (segments[0] === 'publications') {
    if (segments[1]) {
      return { name: 'publication-detail', path: `/publication/${segments[1]}`, params: { id: segments[1] }, query };
    }
    return { name: 'publications', path: '/publications', params: {}, query };
  }

  if (segments[0] === 'publication' && segments[1]) {
    return { name: 'publication-detail', path: `/publication/${segments[1]}`, params: { id: segments[1] }, query };
  }

  if (segments[0] === 'articles') {
    if (segments[1]) {
      return { name: 'article-detail', path: `/article/${segments[1]}`, params: { id: segments[1] }, query };
    }
    return { name: 'articles', path: '/articles', params: {}, query };
  }

  if (segments[0] === 'article' && segments[1]) {
    return { name: 'article-detail', path: `/article/${segments[1]}`, params: { id: segments[1] }, query };
  }

  if (segments[0] === 'categories') {
    if (segments[1]) {
      return { name: 'category-detail', path: `/categories/${segments[1]}`, params: { category: segments[1] }, query };
    }
    return { name: 'categories', path: '/categories', params: {}, query };
  }

  if (segments[0] === 'about') {
    return { name: 'about', path: '/about', params: {}, query };
  }

  if (segments[0] === 'contact') {
    return { name: 'contact', path: '/contact', params: {}, query };
  }

  if (segments[0] === 'search') {
    return { name: 'search', path: '/search', params: {}, query };
  }

  // Fallback 404 or home
  return { name: 'not-found', path: pathStr, params: {}, query };
}

let current = $state(parseRoute(window.location.hash));

// Reactive router. Read `router.current` (`.name`, `.params`, `.query`, `.path`)
// inside components, `$derived` or `$effect` to react to navigation.
export const router = {
  get current() {
    return current;
  }
};

// Listen to hash changes
window.addEventListener('hashchange', () => {
  current = parseRoute(window.location.hash);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

export function navigate(path, query = null) {
  let url = `#${path.startsWith('/') ? path : '/' + path}`;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    url += `?${params.toString()}`;
  }
  window.location.hash = url;
}
