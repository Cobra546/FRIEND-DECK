const CACHE_NAME = "friend-deck-pwa-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./style.css?v=frienddeck-pwa-install-20261111b",
  "./arcade.js?v=frienddeck-pwa-install-20261111b",
  "./app.js?v=frienddeck-mp3-20261113",
  "./profiles.js?v=frienddeck-pwa-install-20261111b",
  "./Friend%20Deck%20%E2%80%93%20Game%20Night.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(APP_SHELL.map((path) => cache.add(path)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("friend-deck-pwa-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        await cache.put("./index.html", fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request)) || (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, fresh.clone());
      }
      return fresh;
    } catch {
      return cached || Response.error();
    }
  })());
});