'use strict';
// Offline werken: de service worker bewaart de app op de tablet (alleen via http/https).
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
