const CACHE_NAME = 'rotaleitura-v1';

const urlsToCache = [

  './',
  './index.html',
  './manifest.json',

  './launchericon-192x192.png',

  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',

  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'

];

/* =========================
   INSTALAÇÃO
========================= */

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))

  );

  self.skipWaiting();

});

/* =========================
   ATIVAÇÃO
========================= */

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

/* =========================
   FETCH
========================= */

self.addEventListener('fetch', event => {

  event.respondWith(

    caches.match(event.request)
    .then(response => {

      if(response){

        return response;

      }

      return fetch(event.request)
      .then(networkResponse => {

        return caches.open(CACHE_NAME)
        .then(cache => {

          cache.put(event.request, networkResponse.clone());

          return networkResponse;

        });

      });

    }).catch(() => {

      return caches.match('./index.html');

    })

  );

});
