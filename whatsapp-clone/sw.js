self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: 'icons/icon.png',
    badge: 'icons/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification('New Notification', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Fungura urupapuro
  );
});
