var shell = [
    "/",
    "./index.html",
    "./scripts/app.js",
    "./styles/inline.css",
    "./favicon.ico",
    "./images/iota.png",
    "./manifest.json",
    "./images/icons/icon-256x256.png",
    "./images/bitcoin_cash.png",
    "./images/bitcoin.png",
    "./images/dash.png",
    "./images/dogecoin.png",
    "./images/ethereum.png",
    "./images/litecoin.png",
    "./images/monero.png",
    "./images/ripple.png"
];

var cacheVersion = "v3";
var cacheDataVersion = "data-v1";

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheVersion).then(function (cache) {
            return cache.addAll(
                shell
            );
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    if (cacheName != cacheVersion)
                        return true;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
    console.log("activated");
});

self.addEventListener('fetch', function(e) {
    var url = 'https://api.coinmarketcap.com/v1/ticker/';
   if(e.request.url.indexOf(url) > -1){
       e.respondWith(


       caches.open(cacheDataVersion).then(function(cache)
       {
        
        return fetch(e.request).then(function(response) {
            cache.put(e.request.url, response.clone());
            return response;
        }).catch(function(){
            return caches.match(e.request).then(function(response) {
                return response;
            })    
        })
       })
    );
   }else{
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
   }
    
  });