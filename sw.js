const CACHE_NAME = 'election-pwa-v3';
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const base = self.registration.scope; // supports Pages subpaths
    const assets = [
      new URL('./', base).toString(),
      new URL('index.html', base).toString(),
      new URL('manifest.json', base).toString(),
      new URL('icons/icon-192.png', base).toString(),
      new URL('icons/icon-512.png', base).toString(),
    ];
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(assets);
  })());
});
self.addEventListener('activate', (event) => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});