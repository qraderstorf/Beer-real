importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const BUILD_VERSION = "v20260722-1725";
const CACHE_NAME = `beerreal-cache-${BUILD_VERSION}`;
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg"
];

// Initialize Firebase in the service worker for FCM support
try {
  firebase.initializeApp({
    apiKey: "AIzaSyCe30xhpzmQd2wxkAvx-YiPbTxsfe2VuUA",
    authDomain: "utility-wares-84dh4.firebaseapp.com",
    projectId: "utility-wares-84dh4",
    storageBucket: "utility-wares-84dh4.firebasestorage.app",
    messagingSenderId: "300733292627",
    appId: "1:300733292627:web:1c0bccf5774f97828826a6"
  });

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log("[PWA SW] FCM Background message received:", payload);
    const title = payload.notification?.title || payload.data?.title || "BeerReal Alert! 🍻";
    const body = payload.notification?.body || payload.data?.body || "A cold beer was logged!";
    const notifId = payload.data?.notificationId || payload.data?.id || "beerreal-notif-" + Date.now();
    const options = {
      body: body,
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: notifId,
      renotify: true,
      vibrate: [100, 50, 100],
      data: payload.data || {}
    };
    self.registration.showNotification(title, options);
  });
} catch (e) {
  console.warn("[PWA SW] Firebase Messaging init skipped or unavailable in SW:", e);
}

// Install: pre-cache core assets and force immediate skipWaiting
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA SW] Pre-caching core assets for version:", BUILD_VERSION);
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith("beerreal-cache-")) {
            console.log("[PWA SW] Invalidating old cache version:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy: Network-First for core shell and asset bundles to guarantee fresh code
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Do not intercept API endpoints, Firestore, Vite dev scripts, or websocket connections
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("firestore") ||
    url.pathname.includes("socket") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@vite") ||
    url.pathname.startsWith("/@fs") ||
    url.search.includes("import")
  ) {
    return;
  }

  if (event.request.method !== "GET") {
    return;
  }

  const isNavigation = event.request.mode === "navigate";
  const isStaticAsset = url.pathname.match(/\.(js|css|json|svg|png|jpg|jpeg|gif|webp|woff|woff2)$/);

  if (isNavigation || isStaticAsset) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If network fetch succeeds with 200, update cache and return
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async (error) => {
          console.warn("[PWA SW] Network fetch failed, falling back to cache for:", event.request.url, error);
          
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If navigation fails completely and is uncached, serve root index.html
          if (isNavigation) {
            const rootCache = await caches.match("/");
            if (rootCache) return rootCache;
          }

          throw error;
        })
    );
  } else {
    // Stale-While-Revalidate for other static media
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request).catch((err) => {
          console.error("[PWA SW] Fetch failed for uncached resource:", event.request.url, err);
          if (isNavigation) {
            return caches.match("/");
          }
        });
      })
    );
  }
});

// Handle SKIP_WAITING and message dispatch
self.addEventListener("message", (event) => {
  if (event.data) {
    if (event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    } else if (event.data.type === "SHOW_NOTIFICATION") {
      const { title, options } = event.data;
      event.waitUntil(
        self.registration.showNotification(title, {
          icon: "/icon.svg",
          badge: "/icon.svg",
          vibrate: [100, 50, 100],
          tag: "beerreal-notification",
          renotify: true,
          ...options
        })
      );
    }
  }
});

// Handle real push event notifications from native Web Push Protocol
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "BeerReal Alert! 🍻", body: event.data.text() };
    }
  }

  const notifObj = data.notification || {};
  const dataObj = data.data || data;

  const title = notifObj.title || dataObj.title || data.title || "BeerReal Alert! 🍻";
  const body = notifObj.body || dataObj.body || data.body || "A cold beer is calling your name! 🍻";
  const notifId = dataObj.notificationId || dataObj.id || data.tag || "beerreal-notif-" + Date.now();

  const options = {
    body: body,
    icon: "/icon.svg",
    badge: "/icon.svg",
    vibrate: [100, 50, 100],
    tag: notifId,
    renotify: true,
    data: dataObj
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Focus or open app window on clicking notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        return client.focus();
      }
      return clients.openWindow("/");
    })
  );
});
