self.addEventListener('install', event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open('v3')
            .then(cache => {
                return cache.addAll([
                    './',
                    './index.html',
                    './script.js',
                    './obj.png'
                ]);
            })
            .then(() => {
                console.log("Assets cached.");
            })
            .catch(err => {
                console.log("Could not cache.", err);

                throw err;
            })
    );
});

self.addEventListener('fetch', event => {
    console.log("INTERCEPTED");

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log(
                    "V3 The request: ",
                    event.request
                );

                console.log(
                    "V3 Got the response...",
                    response
                );

                return response || fetch(event.request);

                /*
                EJEMPLOS MOSTRADOS EN EL VIDEO

                Para probar uno, comenta el return anterior
                y descomenta únicamente el ejemplo elegido.
                */

                // 1. Cambiar la respuesta de obj.png por otra imagen.

                // if (
                //     event.request.url ===
                //     new URL('./obj.png', self.registration.scope).href
                // ) {
                //     return fetch('https://picsum.photos/800');
                // } else {
                //     return response || fetch(event.request);
                // }

                // 2. Obtener otra imagen y guardar su respuesta
                // usando la solicitud original como clave.

                // if (
                //     event.request.url ===
                //     new URL('./obj.png', self.registration.scope).href
                // ) {
                //     return fetch('https://picsum.photos/800')
                //         .then(res => {
                //             return caches.open('v3')
                //                 .then(cache => {
                //                     return cache.put(
                //                         event.request,
                //                         res.clone()
                //                     ).then(() => res);
                //                 });
                //         });
                // } else {
                //     return response || fetch(event.request);
                // }

                // 3. Responder con información de otro sitio.

                // return fetch(
                //     'https://jsonplaceholder.typicode.com/todos/1'
                // );

                // 4. Crear una respuesta vacía.

                // return new Response();
            })
            .catch(err => {
                console.log(
                    "Could not find matching request.",
                    err
                );

                return new Response(
                    'Resource unavailable offline.',
                    { status: 503 }
                );
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys
                        .filter(key => {
                            return key === 'v1' || key === 'v2';
                        })
                        .map(key => {
                            return caches.delete(key);
                        })
                );
            })
    );
});