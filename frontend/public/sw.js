/**
 * Atma Aligner Service Worker - PWA Offline Functionality
 * FASE 2.2 - Mobile-First Optimization
 */

const CACHE_NAME = 'atma-aligner-v1.0';
const OFFLINE_URL = '/offline';

// Essential URLs to cache for offline functionality
const urlsToCache = [
  '/',
  '/pacientes',
  '/ortodontistas',
  '/pacientes/encontre-doutor',
  '/pacientes/precos',
  '/ortodontistas/seja-parceiro',
  '/sobre',
  '/contato',
  '/offline',
];

// Static assets to cache
const staticAssets = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-192x192.png',
  '/icons/maskable-icon-512x512.png',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[Atma SW] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Atma SW] Caching essential resources');
        return cache.addAll([...urlsToCache, ...staticAssets]);
      })
      .then(() => {
        console.log('[Atma SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Atma SW] Installation failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Atma SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Atma SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Atma SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('[Atma SW] Serving from cache:', event.request.url);
          return response;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache successful responses for future use
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed, show offline page for navigation requests
            if (event.request.mode === 'navigate') {
              console.log('[Atma SW] Network failed, serving offline page');
              return caches.match(OFFLINE_URL);
            }

            // For other requests, return a basic offline response
            return new Response(
              JSON.stringify({
                error: 'Você está offline. Conecte-se à internet para acessar este conteúdo.',
                timestamp: new Date().toISOString()
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'application/json',
                })
              }
            );
          });
      })
  );
});

// Background sync for form submissions when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'atma-form-sync') {
    console.log('[Atma SW] Background sync: form submission');
    event.waitUntil(syncFormData());
  }
});

// Push notifications for appointment reminders
self.addEventListener('push', (event) => {
  console.log('[Atma SW] Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'Nova notificação da Atma Aligner',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'atma-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icons/dismiss-action.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Atma Aligner', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Atma SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/?utm_source=push_notification')
    );
  }
});

// Helper function to sync form data
async function syncFormData() {
  try {
    // Get stored form data from IndexedDB
    const storedForms = await getStoredForms();

    for (const formData of storedForms) {
      try {
        const response = await fetch(formData.url, {
          method: 'POST',
          headers: formData.headers,
          body: formData.body
        });

        if (response.ok) {
          await removeStoredForm(formData.id);
          console.log('[Atma SW] Form synced successfully:', formData.id);
        }
      } catch (error) {
        console.error('[Atma SW] Failed to sync form:', formData.id, error);
      }
    }
  } catch (error) {
    console.error('[Atma SW] Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getStoredForms() {
  // Implementation would use IndexedDB to retrieve stored form submissions
  return [];
}

async function removeStoredForm(id) {
  // Implementation would remove synced form from IndexedDB
  console.log('[Atma SW] Removing synced form:', id);
}

// Update notification for new service worker version
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Atma SW] Skipping waiting due to user request');
    self.skipWaiting();
  }
});

console.log('[Atma SW] Service Worker loaded successfully');