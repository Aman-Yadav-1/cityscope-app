'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import { FaBell, FaComment, FaHeart, FaUserPlus } from 'react-icons/fa6';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'follow':
        return <FaUserPlus className="text-green-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };

  const getNotificationText = (notification: any) => {
    if (!notification.user) {
      return <span>You have a new notification</span>;
    }
    
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <span className="font-semibold">{notification.user.name}</span> liked your post: 
            <span className="text-gray-600 italic"> "{notification.postPreview}"</span>
          </span>
        );
      case 'comment':
        return (
          <span>
            <span className="font-semibold">{notification.user.name}</span> commented on your post: 
            <span className="text-gray-600 italic"> "{notification.commentPreview}"</span>
          </span>
        );
      case 'follow':
        return (
          <span>
            <span className="font-semibold">{notification.user.name}</span> started following you
          </span>
        );
      default:
        return <span>You have a new notification</span>;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to view your notifications.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-500 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <FaBell className="text-gray-400 text-4xl mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-2">No Notifications</h2>
            <p className="text-gray-600">You're all caught up! Check back later for new notifications.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                  {notification.user ? (
                    <img 
                      src={notification.user.avatar} 
                      alt={notification.user.name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                      <FaBell className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-gray-100">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <p className="text-sm text-gray-800">
                      {getNotificationText(notification)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
