let registration = null;

function register_service_worker() {
    if ('serviceWorker' in navigator) {
        window.navigator.serviceWorker
            .register('./sw.js', { scope: './' })
            .then(res => {
                registration = res;

                console.log(
                    "Service Worker successfully registered."
                );
            })
            .catch(err => {
                console.log(
                    "Could not register service worker.",
                    err
                );
            });
    }
}

function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();

                console.log("Service Worker unregistered.");
            });
        })
        .catch(err => {
            console.log(
                "Could not unregister service worker.",
                err
            );
        });
}

window.addEventListener('click', () => {
    fetch('./obj.png')
        .then(res => {
            console.log("From script.js: ", res);
        })
        .catch(err => {
            console.log("Could not fetch image.", err);
        });
});

register_service_worker();

// register_service_worker();
// unregister_service_worker(); 