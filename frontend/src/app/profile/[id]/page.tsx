'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UsersAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import PostList from '@/components/PostList';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: {
    type: string;
    coordinates: number[];
    name: string;
  };
  createdAt: string;
}

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await UsersAPI.getUserProfile(id as string) as UserProfile;
        setUser(userData);
        setBioText(userData.bio || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const handleSaveBio = async () => {
    if (!isOwnProfile) return;

    setSavingBio(true);
    try {
      const updatedUser = await UsersAPI.updateProfile({ bio: bioText }) as UserProfile;
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Bio updated successfully!');
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error('Failed to update bio');
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
            <p className="text-gray-600">The user profile you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
              
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 mb-4">
                {user.location && user.location.name && (
                  <div className="flex items-center justify-center md:justify-start">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{user.location.name}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-center md:justify-start">
                  <FaCalendarAlt className="mr-1" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {isEditing ? (
                <div>
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    maxLength={160}
                  ></textarea>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <span className="text-sm text-gray-500">{bioText.length}/160</span>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      disabled={savingBio}
                    >
                      {savingBio ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <p className="text-gray-700">
                    {user.bio || (isOwnProfile ? 'Add a bio to tell people about yourself...' : 'No bio yet.')}
                  </p>
                  
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute top-0 right-0 text-gray-500 hover:text-blue-600"
                      aria-label="Edit bio"
                    >
                      <FaEdit />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Posts by {user.username}</h2>
          <PostList filter={{postType: '', location: ''}} userId={id as string} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
