const CACHE_NAME = "money-check-cache-v2";
const OFFLINE_URLS = ["/", "/app"];

// Never cache API or auth – always hit network so user-specific data stays fresh.
function shouldBypassCache(url) {
  const path = new URL(url).pathname;
  return (
    path.startsWith("/api/") ||
    path.startsWith("/_next/") ||
    path.includes("auth")
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = request.url;

  // API and dynamic data: network only, no cache read/write
  if (shouldBypassCache(url)) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response("Offline", {
          status: 503,
          statusText: "Offline",
        });
      }),
    );
    return;
  }

  // Static/shell: cache-first for offline, but revalidate in background
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Optional: could fetch in background to update cache; for now return cached
        return cached;
      }

      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("/app");
          }
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        });
    }),
  );
});
