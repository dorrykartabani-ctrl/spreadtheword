// Service Worker for Go Spread The Word PWA
const CACHE_NAME = 'gstw-v2'

// Files to cache for offline use
const CACHE_FILES = [
  '/app/index.html',
  '/app/login.html',
  '/app/signup.html',
  '/app/backgrounds.html',
  '/app/editor.html',
  '/app/share.html',
  '/app/library.html',
  '/app/impact.html',
  '/app/cause.html',
  '/app/profile.html',
]

// Install — cache core files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('GSTW: Caching app shell')
      return cache.addAll(CACHE_FILES)
    })
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== CACHE_NAME) {
            console.log('GSTW: Removing old cache', name)
            return caches.delete(name)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch — network first, fallback to cache
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests and Supabase API calls
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('supabase.co')) return
  if (event.request.url.includes('cdn.tailwindcss.com')) return
  if (event.request.url.includes('cdn.jsdelivr.net')) return
  if (event.request.url.includes('fonts.googleapis.com')) return

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Clone and cache successful responses
        if (response.status === 200) {
          var clone = response.clone()
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(function() {
        // Offline — try cache
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('/app/index.html')
        })
      })
  )
})