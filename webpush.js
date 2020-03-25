// Check Browser Supports serviceWorker or not
/**
 * Function that checks whether browser support web push
 * @return  boolean
 */
function checkBrowserCompatibity() {
    if (!('serviceWorker' in navigator)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        alert('Please update browser.');
        return false;
    }
    
    // Check Browser Supports serviceWorker or not
    if (!('PushManager' in window)) {
        // Push isn't supported on this browser, disable or hide UI.
        alert('Please update browser.');
        return false;
    }

    return true;
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Register Service Worker
 *
 */
function registerServiceWorker() {
    return navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {
            console.log('Service worker successfully registered.');
            // return registration;
            // Subscribe user for push
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            };
        
            return registration.pushManager.subscribe(subscribeOptions);
        }).then(function(pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return pushSubscription;
        }).catch(function(err) {
            console.error('Unable to register service worker.', err);
        });
}

/**
 * Ask Notification Permission to User
 *
 */
function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });
        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
    .then(function(permissionResult) {
        console.log(permissionResult);
        if (permissionResult === 'granted') {
            //3. Register Service Worker once Permission `granted` 
            registerServiceWorker();
        } else {
            throw new Error('We weren\'t granted permission.');
        }
    });
}

const VAPID_PUBLIC_KEY =  "BBPWZxXxaWEbkaG_D6DneIMYl0D6OyQRK3sN8ZXhbotUx4us3aUn6eB8sH3Gh1cOw3HyOzJoHC7Vf5KTvUZXFu0";
//1. Check Browser Compatibility
if(checkBrowserCompatibity()) {
    //2. Ask Permission
    // VAPID PUBLIC KEY
    askPermission();
    if(true) {
        // registerServiceWorker();
    }
}