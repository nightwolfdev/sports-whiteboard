// Define variables.
var version = 'v7::',
	urlsToCache = [
		'./',
		'index.html',
		'css/font-awesome.min.css',
		'css/style.css',
		'fonts/FontAwesome.otf',
		'fonts/fontawesome-webfont.eot',
		'fonts/fontawesome-webfont.svg',
		'fonts/fontawesome-webfont.ttf',
		'fonts/fontawesome-webfont.woff',
		'fonts/fontawesome-webfont.woff2',
		'js/libs/p5.dom.min.js',
		'js/libs/p5.min.js',
		'js/board.js',
		'js/index.js'
	];

// Install event listener.
self.addEventListener('install',function(e) {
	e.waitUntil(
		caches.open(version+'whiteboard')
			.then(function(cache) {
				// Cache all files needed to run application.
				return cache.addAll(urlsToCache);
			})
			.then(function() {
				// Install completed.
			})
	);
});

// Fetch event listener.
self.addEventListener('fetch',function(e) {
	e.respondWith(
		caches.match(e.request)
			.then(function(response) {
				// Return cache or network response.
				return response || fetch(e.request);
			})
			.catch(function() {
				// Both cache and network failed.
			})
	);
});

// Activate event listener.
self.addEventListener('activate',function(e) {
	e.waitUntil(
		caches.keys()
			.then(function(cacheNames) {
				return Promise.all(
					cacheNames.filter(function(cacheName) {
						return !cacheName.startsWith(version);
					})
					.map(function(cacheName) {
						// Delete outdated cache.
						return caches.delete(cacheName);
					})
				);
			})
			.then(function() {
				// Activation completed.
			})
	);
});