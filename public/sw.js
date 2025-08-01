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

  // Skip external domains except our own API
  if (url.origin !== self.location.origin) {
    // Let external resources be handled by the browser directly
    event.respondWith(
      fetch(request).catch(error => {
        console.warn('External resource failed:', request.url, error);
        // Return a fallback for failed images
        if (request.destination === 'image') {
          return new Response(
            new Uint8Array([
              0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00,
              0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
              0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90,
              0x77, 0x53, 0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
              0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00, 0x01, 0x00,
              0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
            ]).buffer,
            {
              headers: { 'Content-Type': 'image/png' }
            }
          );
        }
        throw error; // Re-throw for other resource types
      })
    );
    return;
  }

  // Handle API requests with cache-first strategy (only for GET requests)
  if (url.pathname.startsWith('/api/')) {
    // Don't cache POST, PUT, DELETE requests or cart/auth APIs
    if (request.method !== 'GET' || 
        url.pathname.includes('/cart') || 
        url.pathname.includes('/auth') ||
        url.pathname.includes('/orders')) {
      // Just pass through without caching
      event.respondWith(fetch(request));
      return;
    }

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
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // For external resources, handle fetch errors gracefully
      return fetch(request).catch(error => {
        console.warn('Failed to fetch resource:', request.url, error);
        // Return a transparent 1x1 pixel for failed images
        if (request.destination === 'image') {
          return new Response(
            new Uint8Array([
              0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00,
              0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
              0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90,
              0x77, 0x53, 0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
              0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00, 0x01, 0x00,
              0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
            ]).buffer,
            {
              headers: { 'Content-Type': 'image/png' }
            }
          );
        }
        // For other resources, return a 404 response
        return new Response('Resource not found', { 
          status: 404, 
          statusText: 'Not Found' 
        });
      });
    })
  );
});
