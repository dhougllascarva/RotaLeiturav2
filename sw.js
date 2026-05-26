const CACHE_NAME = 'rotaleitura-v13001';

const urlsToCache = [

  '/RotaLeitura/',
  '/RotaLeitura/index.html',
  '/RotaLeitura/manifest.json',
  '/RotaLeitura/indexes.json',

  '/RotaLeitura/171_1.json',
  '/RotaLeitura/171_2.json',

  '/RotaLeitura/172.json',

  '/RotaLeitura/173_1.json',
  '/RotaLeitura/173_2.json',

  '/RotaLeitura/174.json',
  '/RotaLeitura/175.json',
  '/RotaLeitura/176.json',

  '/RotaLeitura/launchericon-192x192.png',
  '/RotaLeitura/launchericon-512x512.png'

];

self.addEventListener('install', event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(urlsToCache);

      })

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

  const url = event.request.url;

  if(

    url.includes('firebase') ||
    url.includes('googleapis')

  ){

    event.respondWith(fetch(event.request));
    return;

  }

  if(
    url.includes('tile.openstreetmap.org')
  ){

    event.respondWith(

      caches.match(event.request)
        .then(response => {

          return response || fetch(event.request)
            .then(networkResponse => {

              caches.open(CACHE_NAME)
                .then(cache => {

                  cache.put(
                    event.request,
                    networkResponse.clone()
                  );

                });

              return networkResponse;

            });

        })

    );

    return;

  }

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

  );

});
