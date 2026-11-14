const CACHE_NAME = "friend-deck-pwa-v23";

// These files are required for the installed app and all local game screens.
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./InShot_20261113_131236610.jpg",
  "./style.css?v=frienddeck-pwa-install-20261111b",
  "./arcade.js?v=frienddeck-newgames-20261114",
  "./app.js?v=frienddeck-results-rematch-20261114",
];

// Audio is optional: a missing MP3 must never prevent the app itself installing.
const OPTIONAL_ASSETS = [
  "./InShot_20261113_174830385.png",
  "./InShot_20261113_180037438.png",
  "./InShot_20261113_180521799.png",
  "./InShot_20261113_180624797.png",
  "./InShot_20261113_180744308.png",
  "./InShot_20261113_180939435.png",
  "./InShot_20261113_181030603.png",
  "./InShot_20261113_181722581.png",
  "./Friend%20Deck%20%E2%80%93%20Game%20Night.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Fail the install if any essential game file cannot be stored.
    await cache.addAll(CORE_ASSETS);
    // Cache music when available, without blocking offline game access.
    await Promise.allSettled(OPTIONAL_ASSETS.map((asset) => cache.add(asset)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith("friend-deck-pwa-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
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
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("./index.html", fresh.clone());
        }
        return fresh;
      } catch {
        return (await caches.match(request))
          || (await caches.match("./index.html"))
          || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, fresh.clone());
      }
      return fresh;
    } catch {
      return Response.error();
    }
  })());
});
