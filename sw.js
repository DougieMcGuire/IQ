self.addEventListener('push', function(event) {
  console.log('Push received:', event);

  let title = 'BrainDeer 🦌';
  let body = 'Your daily brain training is ready!';
  let url = '/app.html';

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
      url = data.url || url;
    } catch(e) {
      // If not JSON, use as plain text body
      body = event.data.text() || body;
    }
  }

  const options = {
    body: body,
    icon: '/3918CB8F-DA0D-4131-B6A7-E60B0102C850.jpeg',
    badge: '/3918CB8F-DA0D-4131-B6A7-E60B0102C850.jpeg',
    tag: 'braindeer-daily',
    renotify: true,
    data: { url: url }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes('braindeer.org') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/app.html');
      }
    })
  );
});
