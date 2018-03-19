self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Instalado');
    // e.waitUntil(
    //     // Lógica salvar o shellscript aqui e deletar o anterior
    // );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Ativado');
    // e.waitUntil(
    //     // Lógica
    // );
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch ', e.request.url);
    //e.waitUntil(
        // Adicionar lógica dos caches aqui
    // );
});