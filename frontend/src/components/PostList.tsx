'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostsAPI, UsersAPI } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiInbox } from 'react-icons/fi';

interface PostListProps {
  filter?: {
    postType: string;
    location: string;
  };
  filterType?: string;
  filterLocation?: string;
  userId?: string;
}

const PostList = ({ filter, filterType, filterLocation, userId }: PostListProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Combine filter props into a single filter object
  const combinedFilter = {
    postType: filterType || (filter?.postType || ''),
    location: filterLocation || (filter?.location || '')
  };

  useEffect(() => {
    fetchPosts();
  }, [page, combinedFilter, userId]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [combinedFilter, userId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let data;
      
      try {
        if (userId) {
          // Fetch posts by user ID
          data = await UsersAPI.getUserPosts(userId, page, 10);
        } else if (combinedFilter.postType === 'bookmarked') {
          // Fetch bookmarked posts
          data = await PostsAPI.getBookmarkedPosts(page, 10);
        } else if (combinedFilter.postType === 'nearby') {
          // Fetch nearby posts based on location
          data = await PostsAPI.getNearbyPosts(page, 10, combinedFilter.location);
        } else {
          // Fetch all posts with filter
          data = await PostsAPI.getPosts(page, 10, combinedFilter);
        }
      } catch (apiError) {
        console.error('API error, falling back to default posts:', apiError);
        // Fallback to regular posts if specialized endpoints fail
        data = await PostsAPI.getPosts(page, 10);
      }
      
      // Ensure data has the expected structure
      const posts = data.posts || data;
      const totalPages = data.totalPages || 1;
      
      setPosts(Array.isArray(posts) ? posts : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await PostsAPI.likePost(postId);
      
      // Update post in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: response.likes, dislikes: response.dislikes } 
            : post
        )
      );
    } catch (error) {
      toast.error('Failed to like post. Please try again.');
    }
  };

  const handleDislike = async (postId: string) => {
    try {
      const response = await PostsAPI.dislikePost(postId);
      
      // Update post in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: response.likes, dislikes: response.dislikes } 
            : post
        )
      );
    } catch (error) {
      toast.error('Failed to dislike post. Please try again.');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await PostsAPI.deletePost(postId);
      
      // Remove post from state
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const handleReply = async (postId: string, content: string) => {
    try {
      const newReply = await PostsAPI.addReply(postId, content);
      
      // Update post in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                replies: [newReply, ...post.replies] 
              } 
            : post
        )
      );
      
      return true;
    } catch (error) {
      toast.error('Failed to add reply. Please try again.');
      return false;
    }
  };

  // Animation variants for the list container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for the loading skeleton
  const skeletonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Animation variants for the empty state
  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  // Animation variants for the load more button
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setAnimationComplete(true)}
    >
      <AnimatePresence mode="wait">
        {loading && posts.length === 0 ? (
          <motion.div 
            key="loading"
            className="flex justify-center items-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 my-4"
            variants={skeletonVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col items-center">
              <FiRefreshCw className="animate-spin text-blue-500 text-3xl mb-3" />
              <p className="text-gray-600 font-medium">Loading posts...</p>
            </div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div 
            key="empty"
            className="text-center my-6 p-8 bg-white rounded-xl shadow-sm border border-gray-100"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div 
              className="mb-4 text-gray-400"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <FiInbox className="w-16 h-16 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No posts found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {combinedFilter.postType || combinedFilter.location 
                ? 'Try changing your filters to see more posts.' 
                : 'Be the first to create a post in your community!'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onDelete={handleDelete}
                    onReply={handleReply}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center mt-8 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: animationComplete ? 1 : 0, 
                  y: animationComplete ? 0 : 20 
                }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.5 
                }}
              >
                <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 divide-x divide-gray-100">
                  <motion.button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={page === 1 
                      ? "px-4 py-2 text-gray-400 cursor-not-allowed" 
                      : "px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors"}
                    whileHover={page !== 1 ? { scale: 1.05 } : undefined}
                    whileTap={page !== 1 ? { scale: 0.95 } : undefined}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      Previous
                    </span>
                  </motion.button>
                  
                  <div className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {page} of {totalPages}
                  </div>
                  
                  <motion.button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={page === totalPages 
                      ? "px-4 py-2 text-gray-400 cursor-not-allowed" 
                      : "px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors"}
                    whileHover={page !== totalPages ? { scale: 1.05 } : undefined}
                    whileTap={page !== totalPages ? { scale: 0.95 } : undefined}
                  >
                    <span className="flex items-center">
                      Next
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostList;
