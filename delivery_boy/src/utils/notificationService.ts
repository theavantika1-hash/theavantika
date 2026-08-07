import { Alert } from 'react-native';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'system' | 'rating' | 'payment';
  orderId?: string;
  isRead: boolean;
}

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'New Order Assigned! 🛵',
    message: 'Order #AV-9812 assigned to you. Pickup at Avantika Kitchen.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'order',
    orderId: 'AV-9812',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Order Ready for Pickup 📦',
    message: 'Restaurant updated status to Ready to Pickup for Order #AV-44212.',
    timestamp: '10:15 AM',
    type: 'order',
    orderId: 'AV-44212',
    isRead: false,
  },
  {
    id: 'n3',
    title: '5 Star Rating Received ⭐',
    message: 'Customer Jane Doe rated your delivery 5 stars!',
    timestamp: 'Yesterday',
    type: 'rating',
    isRead: true,
  },
  {
    id: 'n4',
    title: 'Cash Deposit Reminder 💰',
    message: 'Please deposit collected COD cash at your nearest branch.',
    timestamp: 'Yesterday',
    type: 'payment',
    isRead: true,
  },
];

let notificationsList: AppNotification[] = [...initialNotifications];
let listeners: Array<(notifs: AppNotification[]) => void> = [];

export const notificationService = {
  getNotifications: (): AppNotification[] => {
    return [...notificationsList];
  },

  getUnreadCount: (): number => {
    return notificationsList.filter((n) => !n.isRead).length;
  },

  addNotification: (
    title: string,
    message: string,
    type: 'order' | 'system' | 'rating' | 'payment' = 'order',
    orderId?: string,
  ): AppNotification => {
    const newNotif: AppNotification = {
      id: `n_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      orderId,
      isRead: false,
    };

    notificationsList = [newNotif, ...notificationsList];
    listeners.forEach((fn) => fn([...notificationsList]));

    // Trigger functional system popup alert
    Alert.alert(`🔔 ${title}`, message);

    return newNotif;
  },

  markAsRead: (id: string) => {
    notificationsList = notificationsList.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    listeners.forEach((fn) => fn([...notificationsList]));
  },

  markAllAsRead: () => {
    notificationsList = notificationsList.map((n) => ({ ...n, isRead: true }));
    listeners.forEach((fn) => fn([...notificationsList]));
  },

  clearAll: () => {
    notificationsList = [];
    listeners.forEach((fn) => fn([]));
  },

  subscribe: (listener: (notifs: AppNotification[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  },
};
