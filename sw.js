// Keeps Toverschool Sterrenlicht working without internet.
// Change VERSION whenever a file changes, so tablets pick up the new version.
const VERSION = 'toverschool-v9';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png', './css/app.css',
  './js/util.js', './js/i18n.js', './js/visuals.js', './js/art.js', './js/fun.js', './js/rekenen.js', './js/taal.js', './js/papiamentu.js', './js/app.js',
  './js/review.js', './js/voice.js', './js/extra.js', './js/sw-register.js', './js/theme.js', './js/motion.js', './js/garden.js', './js/delight.js', './js/collect.js', './js/games2.js',
  ...['sky-day', 'sky-night', 'clouds', 'sea-day', 'sea-night', 'houses', 'bridge', 'lights'].map(f => `./img/scene/${f}.svg`)];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Try the network first (so updates arrive), fall back to the saved copy when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
