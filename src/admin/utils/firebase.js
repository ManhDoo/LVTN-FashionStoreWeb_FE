import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB_WMdiAm3ZImPbICM3rQnfPQeSTXwJuDs",
  authDomain: "fashionstore-e91ec.firebaseapp.com",
  projectId: "fashionstore-e91ec",
  storageBucket: "fashionstore-e91ec.firebasestorage.app",
  messagingSenderId: "596904374489",
  appId: "1:596904374489:web:4924f56dd49c0f811d4ec8",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

export { messaging, getToken, onMessage };