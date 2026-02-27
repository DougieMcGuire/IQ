self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'BrainDeer 🦌', {
      body: data.body || "Your daily brain training is ready!",
      icon: '/3918CB8F-DA0D-4131-B6A7-E60B0102C850.jpeg',
      data: { url: data.url || '/app.html' }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
