// sw.js
// Service worker script for handling offline caching
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open('epub-reader-cache-v1').then(cache => {
            return cache.addAll([
                '/',
                'index.html',
                'app.js',
                'styles.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});