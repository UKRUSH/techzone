// Simple service worker for instant page caching
const CACHE_NAME = 'techzone-v1';
const CRITICAL_PAGES = [
  '/',
  '/products',
  '/categories', 
  '/pc-builder',
  '/deals',
  '/cart'
];

const API_CACHE_NAME = 'techzone-api-v1';
const API_ENDPOINTS = [
  '/api/products/fast',
  '/api/categories',
  '/api/brands'
];

// Install event - cache critical pages immediately
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(CRITICAL_PAGES);
      }),
      caches.open(API_CACHE_NAME).then(cache => {
        return cache.addAll(API_ENDPOINTS.map(endpoint => 
          new Request(endpoint, { mode: 'no-cors' })
        ));
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache first for instant loading
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with cache-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache immediately
          fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
              caches.open(API_CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
              });
            }
          }).catch(() => {
            // Network failed, cached response already served
          });
          return cachedResponse;
        }
        
        // No cache, fetch from network
        return fetch(request).then(networkResponse => {
          if (networkResponse.ok && networkResponse.body) {
            const responseToCache = networkResponse.clone();
            caches.open(API_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Return a fallback response for API failures
          return new Response(JSON.stringify({
            success: false,
            products: [],
            categories: [],
            brands: [],
            cached: false,
            fallback: true
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Handle page requests with cache-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache immediately, update in background
          fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
              });
            }
          }).catch(() => {
            // Network failed, cached response already served
          });
          return cachedResponse;
        }
        
        // No cache, fetch from network
        return fetch(request).then(networkResponse => {
          // Check if response is valid and body is available before cloning
          if (networkResponse.ok && networkResponse.body && !networkResponse.bodyUsed) {
            // Clone the response before consuming it
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            }).catch(error => {
              console.warn('Cache storage failed:', error);
            });
          }
          return networkResponse;
        }).catch(error => {
          console.warn('Network request failed:', error);
          // Return a basic error response instead of letting it fail
          return new Response('Service temporarily unavailable', { 
            status: 503, 
            statusText: 'Service Unavailable' 
          });
        });
      })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request);
    })
  );
});
