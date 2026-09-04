const CACHE = "dakkai-v8-fixes";
const APP_SHELL = [
  "./", "./index.html", "./cardapio.html", "./styles.css", "./dakkai-extra.css",
  "./config.js", "./script.js", "./menu.js", "./assistant.js", "./manifest.webmanifest",
  "./assets/logo-dakkai.webp", "./assets/logo-dakkai.png", "./assets/favicon-64.png",
  "./assets/icon-192.png", "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const isPage = event.request.mode === "navigate";
  const isFreshFile = isPage || /\.(?:html|css|js|webmanifest)$/.test(url.pathname);
  if (isFreshFile) {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(event.request)) || (isPage ? caches.match("./index.html") : Response.error())));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});
