// NotificationContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Notification {
  id: string; // ✅ changed from number to string for uniqueness
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (msg: string, type?: Notification['type']) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const newNotification: Notification = {
      id: crypto.randomUUID(), // ✅ ensures uniqueness
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
