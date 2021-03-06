var cacheName = 'crypto-pwa-v1';
var dataCacheName = 'crypto-pwa-data-v1';
var url = '';
if (location.hostname === "m4rkux.github.io") {
    url = '/crypto-pwa'
}
var filesToCache = [
    url + '/',
    url + '/index.html',
    url + '/styles/inline.css',
    url + '/scripts/app.js',
    url + '/images/ic_add_white_24px.svg',
    url + '/images/ic_refresh_white_24px.svg',
    url + '/images/icons/icon-256x256.png',
    url + '/images/bitcoin_cash.png',
    url + '/images/bitcoin.png',
    url + '/images/dash.png',
    url + '/images/dogecoin.png',
    url + '/images/ethereum.png',
    url + '/images/iota.png',
    url + '/images/litecoin.png',
    url + '/images/monero.png',
    url + '/images/ripple.png',
    url + '/manifest.json '
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Instalado');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Ativado');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }))
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch ', e.request.url);
    var dataUrl = 'https://api.coinmarketcap.com/v1/';
    if (e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(
            caches.open(dataCacheName).then(function (cache) {
                return fetch(e.request).then(function (response) {
                    cache.put(e.request.url, response.clone());
                    return response;
                }).catch(function () {
                    return caches.match(e.request).then(function (response) {
                        return response;
                    })
                })
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});