'use client';

import React, { useState, useContext, useEffect } from 'react';
import Layout from '@/components/Layout';
import AuthContext from '@/context/AuthContext';
import { FaCog, FaBell, FaLock, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: true,
    locationSharing: 'public', // 'public', 'friends', 'none'
    darkMode: false,
    language: 'en',
  });

  useEffect(() => {
    // In a real app, we would fetch the user's settings from the API
    // For now, we'll use mock data
  }, []);

  const handleToggleChange = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would save the settings to the API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to access settings.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <FaCog className="text-2xl text-gray-700 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                <img 
                  src={user.avatar || "https://via.placeholder.com/150"} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-4">
              <FaBell className="text-lg text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications about activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notificationsEnabled}
                    onChange={() => handleToggleChange('notificationsEnabled')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.emailNotifications}
                    onChange={() => handleToggleChange('emailNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-4">
              <FaLock className="text-lg text-green-500 mr-2" />
              <h2 className="text-lg font-semibold">Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Location Sharing</h3>
                <select 
                  name="locationSharing"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.locationSharing}
                  onChange={handleSelectChange}
                >
                  <option value="public">Public - Everyone can see my location</option>
                  <option value="friends">Friends Only - Only people I follow can see my location</option>
                  <option value="none">Private - No one can see my location</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Use dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.darkMode}
                    onChange={() => handleToggleChange('darkMode')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <select 
                  name="language"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.language}
                  onChange={handleSelectChange}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 flex justify-between">
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
            
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
