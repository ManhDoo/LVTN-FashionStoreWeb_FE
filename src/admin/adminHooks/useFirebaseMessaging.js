import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../utils/firebase';
import axiosAdmin from '../utils/axiosAdmin';

const useFirebaseMessaging = () => {
  const [token, setToken] = useState(null);

  // Hàm đăng ký topic
  const subscribeToTopic = async (fcmToken) => {
    try {
      await axiosAdmin.post('/api/subscribe-to-topic', {
        token: fcmToken,
        topic: 'admin_notifications',
      });
      // console.log('Đã đăng ký topic admin_notifications');
    } catch (err) {
      console.error('Lỗi khi đăng ký topic:', err);
    }
  };

  // Hàm hủy đăng ký topic
  const unsubscribeFromTopic = async (fcmToken) => {
    try {
      await axiosAdmin.post('/api/unsubscribe-from-topic', {
        token: fcmToken,
        topic: 'admin_notifications',
      });
      // console.log('Đã hủy đăng ký topic admin_notifications');
    } catch (err) {
      console.error('Lỗi khi hủy đăng ký topic:', err);
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập admin
    const adminToken = localStorage.getItem('tokenAdmin');
    const quyen = localStorage.getItem('quyen');

    if (adminToken && quyen === 'ADMIN') {
      // Yêu cầu quyền thông báo
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // console.log('Đã cấp quyền thông báo.');
          // Lấy token FCM
          getToken(messaging, {
            vapidKey: 'BIv5iLeGe5sXTwvxdThtVPNXozXvlavEe0qAyaEaAszI4Sv7yh1utLqH0aqFtiQcEzICWJKqnzDxEYm88NCXqN4',
          })
            .then((currentToken) => {
              if (currentToken) {
                setToken(currentToken);
                // console.log('FCM Token:', currentToken);
                // Đăng ký topic nếu admin đã đăng nhập
                subscribeToTopic(currentToken);
              } else {
                console.log('Không lấy được token FCM.');
              }
            })
            .catch((err) => {
              console.error('Lỗi khi lấy token FCM:', err);
            });
        }
      });

      // Lắng nghe thông báo foreground
      onMessage(messaging, (payload) => {
        // console.log('Thông báo foreground nhận được:', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/favicon.ico',
        };
        new Notification(notificationTitle, notificationOptions);
      });
    }

    // Dọn dẹp: Hủy đăng ký khi component unmount hoặc admin đăng xuất
    return () => {
      if (token && (!adminToken || quyen !== 'ADMIN')) {
        unsubscribeFromTopic(token);
      }
    };
  }, [token]);

  return { token, unsubscribeFromTopic };
};

export default useFirebaseMessaging;