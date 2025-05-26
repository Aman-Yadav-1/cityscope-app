'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Define notification types
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  postId?: string;
  postPreview?: string;
  commentPreview?: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
}

// Create the context
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  fetchNotifications: async () => {},
});

// Mock notifications data - in a real app, this would come from an API
const mockNotifications = [
  {
    id: '1',
    type: 'like' as const,
    user: {
      id: '101',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    postId: '201',
    postPreview: 'Looking for recommendations for a good coffee shop in...',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    type: 'comment' as const,
    user: {
      id: '102',
      name: 'Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    postId: '202',
    postPreview: 'Anyone know a good plumber in the neighborhood?',
    commentPreview: 'I can recommend someone who helped me last week...',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
  },
  {
    id: '3',
    type: 'follow' as const,
    user: {
      id: '103',
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications from API (mock implementation)
  const fetchNotifications = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/notifications');
      // setNotifications(response.data);
      
      // For now, use mock data
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/notifications/${id}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.put('/api/notifications/read-all');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;
