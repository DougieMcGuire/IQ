importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDv3SpKBi_bS6hwfKABho55vA52VjwRZPE",
  authDomain: "roblox-df2ad.firebaseapp.com",
  projectId: "roblox-df2ad",
  messagingSenderId: "323286791287",
  appId: "1:323286791287:web:c895be3f1802017086c272"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png"
  });
});
