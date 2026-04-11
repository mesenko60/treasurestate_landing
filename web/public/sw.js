const CACHE_VERSION = 'ts-pwa-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const MAP_CACHE = `${CACHE_VERSION}-maps`;

const STATIC_ASSETS = [
  '/nearby/',
  '/css/modern-style.css',
  '/fonts/montserrat-latin.woff2',
  '/fonts/opensans-latin.woff2',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('ts-pwa-') && key !== STATIC_CACHE && key !== DATA_CACHE && key !== MAP_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache Supabase API/RPC responses (POI data) with network-first
  if (url.pathname.includes('/rest/v1/rpc/nearby_pois') || url.pathname.includes('/functions/v1/nearby-pois')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(event.request))
      )
    );
    return;
  }

  // Cache map tiles with cache-first
  if (url.hostname.includes('mapbox') && (url.pathname.includes('/tiles/') || url.pathname.includes('/styles/'))) {
    event.respondWith(
      caches.open(MAP_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Cache static assets with cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok && (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.png') || url.pathname.endsWith('.webp'))) {
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }
});

// Periodic cache cleanup — limit map tile cache to ~50MB
self.addEventListener('message', (event) => {
  if (event.data === 'cleanup-caches') {
    caches.open(MAP_CACHE).then(async (cache) => {
      const keys = await cache.keys();
      if (keys.length > 500) {
        const toDelete = keys.slice(0, keys.length - 500);
        await Promise.all(toDelete.map((k) => cache.delete(k)));
      }
    });
  }
});
