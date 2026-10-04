// EarthPulse service worker — makes the app installable + gives it an offline shell.
// Dependency-free. The app is all-live, so data APIs always go to the network;
// we only cache the app shell + static build assets so it opens instantly / offline.

const CACHE = 'earthpulse-shell-v1'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Page navigations: network-first (always try for the freshest shell),
  // fall back to the cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('/', copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match('/').then((r) => r || caches.match('/index.html'))),
    )
    return
  }

  // Cross-origin (the live public-data APIs): straight to network, never cached —
  // the dashboard must always show real current data.
  if (url.origin !== self.location.origin) return

  // Same-origin static assets (hashed JS/CSS/icons): cache-first, fill at runtime.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
          }
          return res
        }),
    ),
  )
})
