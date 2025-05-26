'use client';

import React, { useState, useEffect, useContext } from 'react';
import Layout from '@/components/Layout';
import PostList from '@/components/PostList';
import AuthContext from '@/context/AuthContext';
import { FaBookmark } from 'react-icons/fa6';

const BookmarksPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch bookmarked posts
    const timer = setTimeout(() => {
      setLoading(false);
      // In a real app, we would fetch the user's bookmarked posts from the API
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to view your bookmarks.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bookmarks</h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* In a real app, we would use the actual bookmarked posts */}
            {/* For now, we'll use the PostList component with a special filter */}
            <PostList filterType="bookmarked" />
            
            {/* Empty state if no bookmarks */}
            {bookmarkedPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center mt-4">
                <FaBookmark className="text-gray-400 text-4xl mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">No Bookmarks Yet</h2>
                <p className="text-gray-600">
                  When you bookmark posts, they'll appear here for easy access.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default BookmarksPage;
