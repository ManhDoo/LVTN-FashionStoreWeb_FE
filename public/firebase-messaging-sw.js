// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB_WMdiAm3ZImPbICM3rQnfPQeSTXwJuDs",
  authDomain: "fashionstore-e91ec.firebaseapp.com",
  projectId: "fashionstore-e91ec",
  storageBucket: "fashionstore-e91ec.appspot.com",
  messagingSenderId: "596904374489",
  appId: "1:596904374489:web:4924f56dd49c0f811d4ec8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
