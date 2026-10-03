// Network first, so a new page always wins; the last copy opens offline.
const CACHE = "school-v2";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;  // relay and fonts go straight out
  // no-cache: always ask GitHub for the newest page instead of a 10-minute-old copy
  e.respondWith(fetch(e.request, {cache: "no-cache"}).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match(e.request)));
});
