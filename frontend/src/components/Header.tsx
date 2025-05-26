'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import { FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { FaGear, FaPlus } from 'react-icons/fa6';
import { FiMenu } from 'react-icons/fi';
import { FiCompass, FiBell, FiBookmark, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  // For Next.js 13 App Router, we can use usePathname
  // But for compatibility, let's use a simple state approach
  const [pathname, setPathname] = useState('');
  
  useEffect(() => {
    // Set the pathname on client-side only
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);
  
  // Using window.location.pathname to track current route

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    // No need to navigate manually, auth context will handle this
  };

  return (
    <header className={`bg-white sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {toggleSidebar && (
            <motion.button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
            >
              <FiMenu className="text-gray-700" />
            </motion.button>
          )}
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full">
              <FiMapPin className="text-xl" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 tracking-tight">CityScope</span>
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center space-x-1 md:space-x-6">
            <nav className="hidden md:flex space-x-1 items-center">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-full transition-colors font-medium flex items-center ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <FaHome className="mr-2" />
                <span>Home</span>
              </Link>
              <Link 
                href="/explore" 
                className={`px-3 py-2 rounded-full transition-colors font-medium flex items-center ${pathname === '/explore' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <FiCompass className="mr-2" />
                <span>Explore</span>
              </Link>
              <Link 
                href="/notifications" 
                className={`px-3 py-2 rounded-full transition-colors font-medium flex items-center ${pathname === '/notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <div className="relative">
                  <FiBell className="mr-2" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </Link>
              <Link 
                href="/bookmarks" 
                className={`px-3 py-2 rounded-full transition-colors font-medium flex items-center ${pathname === '/bookmarks' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <FiBookmark className="mr-2" />
                <span>Bookmarks</span>
              </Link>
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="ml-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full transition-colors shadow-sm flex items-center"
              >
                <FaPlus className="mr-1" />
                <span>Create</span>
              </button>
            </nav>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                type="button"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 border-2 border-blue-200 overflow-hidden hover:shadow-md transition-all">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-lg" />
                  )}
                </div>
                <span className="hidden md:inline-block font-medium text-gray-700">
                  {user?.username}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-10 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaHome className="mr-3 text-blue-500" />
                      Home
                    </Link>
                    <Link
                      href={`/profile/${user?._id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="mr-3 text-blue-500" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaGear className="mr-3 text-blue-500" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center transition-colors"
                      type="button"
                    >
                      <FaSignOutAlt className="mr-3 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
