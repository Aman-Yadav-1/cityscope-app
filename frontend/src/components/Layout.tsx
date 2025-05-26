'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { FaHome, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { FiCompass } from 'react-icons/fi';
import { FiBell, FiBookmark, FiSettings } from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Check if the screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Animation variants for the sidebar
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };
  
  // Animation variants for the main content
  const mainContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full">
            <FaMapMarkerAlt className="text-xl" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 tracking-tight">CityScope</span>
        </Link>
        
        {isAuthenticated && user && (
          <div className="flex items-center space-x-3 mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 border-2 border-blue-200 overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <FaUser className="text-xl" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.username}</p>
              <Link href={`/profile/${user._id}`} className="text-xs text-blue-600 hover:underline">View Profile</Link>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
            <FaHome className="text-blue-500" />
            <span className="font-medium">Home</span>
          </Link>
          <Link href="/explore" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
            <FiCompass className="text-blue-500" />
            <span className="font-medium">Explore</span>
          </Link>
          <Link href="/notifications" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
            <div className="relative">
              <FiBell className="text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </div>
            <span className="font-medium">Notifications</span>
          </Link>
          <Link href="/bookmarks" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
            <FiBookmark className="text-blue-500" />
            <span className="font-medium">Bookmarks</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
            <FiSettings className="text-blue-500" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </nav>
      
      <div className="p-4 mt-auto">
        <button 
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl py-3 transition-colors shadow-sm"
        >
          Create Post
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Only show header on mobile */}
      {isMobile && <Header toggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)} />}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside 
            className="hidden lg:block w-64 bg-white border-r border-gray-200 overflow-y-auto"
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
          >
            <SidebarContent />
          </motion.aside>
        )}
        
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobile && showMobileSidebar && (
            <motion.div 
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileSidebar(false)}></div>
              <motion.aside 
                className="relative w-64 max-w-xs h-full bg-white overflow-y-auto"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <SidebarContent />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <motion.main 
          className="flex-1 overflow-y-auto p-4 lg:p-6"
          initial="hidden"
          animate="visible"
          variants={mainContentVariants}
        >
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </motion.main>
        
        {/* Right Sidebar - Trending/Suggestions */}
        <motion.aside 
          className="hidden xl:block w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Trending in Your Area</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="text-xs text-blue-600 font-medium">#{i === 1 ? 'LocalFestival' : i === 2 ? 'CommunityCleanup' : 'FarmersMarket'}</p>
                    <p className="text-sm text-gray-700 mt-1">{i === 1 ? 'Annual Spring Festival this weekend!' : i === 2 ? 'Join the neighborhood cleanup' : 'Fresh produce at the market today'}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Nearby Places</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-blue-600">
                      <span className="text-sm">{i === 1 ? '🍽️' : i === 2 ? '☕' : '🏞️'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{i === 1 ? 'Riverside Grill' : i === 2 ? 'Morning Brew Café' : 'Central Park'}</p>
                      <p className="text-xs text-gray-500">{i === 1 ? '0.8 miles away' : i === 2 ? '0.3 miles away' : '1.2 miles away'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CityScope - Connect with your local community</p>
        </div>
      </footer>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Layout;
