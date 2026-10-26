// Seite: erst Netz (Updates kommen sofort an), sonst Cache. MathJax und Schriften: einmal laden, dann aus dem Cache.
const CACHE = "buk-10bd843c5d";
const CORE = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const own = new URL(r.url).origin === location.origin;
  if (own) {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then((k) => k.put(r.mode === "navigate" ? "./" : r, c)); } return res; })
      .catch(() => caches.match(r.mode === "navigate" ? "./" : r)));
  } else {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok || res.type === "opaque") { const c = res.clone(); caches.open(CACHE).then((k) => k.put(r, c)); } return res; })));
  }
});
