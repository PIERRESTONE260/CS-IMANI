const CACHE_NAME = 'imani-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/admis.html',
  '/actualites.html',
  '/contact.html',
  '/inscription.html',
  '/resultats.html',
  '/global.css',
  '/home.css',
  '/actuelites.css',
  '/contact.css',
  '/inscription.css',
  '/resultats.css',
  '/admis.css',
  '/navigation.js',
  '/inscription.js',
  '/resultats.js',
  '/admis.js',
  '/actualites.js',
  '/trousseau.js',
  '/logo.svg',
  '/favicon.svg',
  '/manifest.json'
];

// Installation : Mise en cache des fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Interception des requêtes pour le mode hors-ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});