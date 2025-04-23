self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('wifi-qr-cache').then(cache => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});