const CACHE_NAME = 'new-tab-v1';
const CORE_ASSETS = [
    './',
    './newtab.html',
    './manifest.json',
    './assets/icon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    if (req.mode === 'navigate') {
        event.respondWith(
            caches.match('./index.html').then((cached) => cached || fetch(req))
        );
        return;
    }

    if (req.destination === 'image') {
        event.respondWith(
            caches.match(req).then((cached) => {
                const fetchPromise = fetch(req).then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    return res;
                }).catch(() => cached);
                // Stale-while-revalidate for images (like daily wallpapers)
                if (cached) {
                    // Kick off the fetch in the background to update the cache for next time
                    event.waitUntil(fetchPromise);
                    return cached;
                }
                return fetchPromise;
            })
        );
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req).then((res) => {
            if (url.origin === location.origin) {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return res;
        }))
    );
});
