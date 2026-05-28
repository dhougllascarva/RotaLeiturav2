const CACHE_NAME = 'rotaleitura-v1';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './launchericon-192x192.png'
];

self.addEventListener('install', event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))

  );

});

self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if(key !== CACHE_NAME){
            return caches.delete(key);
          }

        })

      );

    })

  );

  self.clients.claim();

});

self.addEventListener('fetch', event => {

  if(event.request.method !== 'GET') return;

  event.respondWith(

    caches.match(event.request)
    .then(response => {

      return response || fetch(event.request);

    })

  );

});
