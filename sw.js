const CACHE = 'gallery-v1';
const STATIC = [
  './',
  './index.html',
  './manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Syne:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Cache-first for static assets (fonts, CSS, JS from CDN)
  if (e.request.destination === 'style' ||
      e.request.destination === 'script' ||
      e.request.destination === 'font') {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // Network-first for data.json and thumbnails (always fresh)
  if (url.pathname.endsWith('data.json') || e.request.destination === 'image') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else (HTML shell)
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
