/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { getItem } from './helpers';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }
    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')
      || url.pathname.match(fileExtensionRegexp)
      || url.pathname.match('/map')) {
      return false;
    }


    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);


// precache our data
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.json'),
  new StaleWhileRevalidate({
    cacheName: 'images-wm-json',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 400,
      }),
    ],
  })
);

// Precache our own images
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images-wm-landing',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 300,
      }),
    ],
  })
);

// Precache the map images
registerRoute(
  ({ url }) => url.hostname === "mocha.affectedarc07.io" && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images-wm-maps',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 300,
      }), // 1 is like, 2mb~
    ],
  })
);

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
