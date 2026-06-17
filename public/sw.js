// Service worker for TechZone - page & API caching only
const CACHE_NAME = 'techzone-v3';
const API_CACHE_NAME = 'techzone-api-v3';

const CACHED_PAGES = ['/', '/products', '/categories', '/pc-builder', '/deals', '/cart'];
const CACHED_APIS  = ['/api/products/fast', '/api/categories', '/api/brands'];

// Install - pre-cache pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHED_PAGES)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate - delete ALL old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== API_CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ── Never intercept Next.js internals ───────────────────────────────────────
  // _next/static assets already carry content hashes; caching them here causes
  // stale-chunk 404s every time the dev server restarts or a new build deploys.
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(fetch(request));
    return;
  }

  // ── External origins: pass through, fallback 1×1 PNG for images ─────────────
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => {
        if (request.destination === 'image') return transparentPng();
        return new Response('', { status: 503 });
      })
    );
    return;
  }

  // ── Auth / cart / orders: always network, never cache ───────────────────────
  if (
    url.pathname.includes('/auth') ||
    url.pathname.includes('/cart') ||
    url.pathname.includes('/orders')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // ── GET API calls: stale-while-revalidate ────────────────────────────────────
  if (request.method === 'GET' && url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE_NAME));
    return;
  }

  // ── Page navigation: network-first, cache fallback ──────────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── Everything else: network only ───────────────────────────────────────────
  event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then(res => {
    if (res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);
  return cached || network;
}

function transparentPng() {
  const bytes = new Uint8Array([
    0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A,0x00,0x00,0x00,0x0D,0x49,0x48,0x44,0x52,
    0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x08,0x06,0x00,0x00,0x00,0x1F,0x15,0xC4,
    0x89,0x00,0x00,0x00,0x0B,0x49,0x44,0x41,0x54,0x08,0xD7,0x63,0x60,0x00,0x00,0x00,
    0x02,0x00,0x01,0xE2,0x21,0xBC,0x33,0x00,0x00,0x00,0x00,0x49,0x45,0x4E,0x44,0xAE,
    0x42,0x60,0x82,
  ]);
  return new Response(bytes.buffer, { headers: { 'Content-Type': 'image/png' } });
}
