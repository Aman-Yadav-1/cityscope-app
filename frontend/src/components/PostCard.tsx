'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FaThumbsUp, FaThumbsDown, FaTrash } from 'react-icons/fa';
import { FiMessageCircle, FiShare2, FiMapPin, FiHeart, FiMoreHorizontal, FiBookmark, FiCheck, FiX } from 'react-icons/fi';
import { PostsAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface PostUser {
  _id: string;
  username: string;
  profileImage?: string;
}

interface Reply {
  _id: string;
  user: PostUser;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  user: PostUser;
  content: string;
  postType: string;
  image?: string;
  location?: {
    type: string;
    coordinates: number[];
    name: string;
  };
  likes: string[];
  dislikes: string[];
  bookmarks?: string[];
  replies: Reply[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onReply: (postId: string, content: string) => Promise<boolean>;
}

const POST_TYPES = [
  { value: 'recommend_place', label: 'Recommendation', color: 'blue', icon: '🏆' },
  { value: 'ask_help', label: 'Help Request', color: 'yellow', icon: '🆘' },
  { value: 'local_update', label: 'Local Update', color: 'green', icon: '📢' },
  { value: 'event_announcement', label: 'Event', color: 'purple', icon: '🎉' }
];

const PostCard = ({ post, onLike, onDislike, onDelete, onReply }: PostCardProps) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [isBookmarking, setIsBookmarking] = useState(false);

  const isLiked = user && post.likes.includes(user._id);
  const isDisliked = user && post.dislikes.includes(user._id);
  const isBookmarked = user && post.bookmarks?.includes(user._id);
  const isOwnPost = user && post.user._id === user._id;

  const getPostTypeInfo = (type: string) => {
    const postType = POST_TYPES.find(t => t.value === type) || POST_TYPES[2]; // Default to local update
    return postType;
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    try {
      await onLike(post._id);
    } catch (error: any) {
      alert(error.response?.data?.msg || 'Failed to like post');
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please log in to dislike posts');
      return;
    }

    try {
      await onDislike(post._id);
    } catch (error: any) {
      alert(error.response?.data?.msg || 'Failed to dislike post');
    }
  };

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to reply to posts');
      return;
    }
    
    if (replyContent.trim() === '') {
      alert('Reply cannot be empty');
      return;
    }
    
    setSubmittingReply(true);
    
    try {
      const success = await onReply(post._id, replyContent);
      
      if (success) {
        setReplyContent('');
        setShowReplyForm(false);
        setShowReplies(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.msg || 'Failed to add reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user || user._id !== post.user._id) {
      alert('You can only delete your own posts');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post._id);
      } catch (error: any) {
        alert(error.response?.data?.msg || 'Failed to delete post');
      }
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      setDialogMessage('Please log in to bookmark posts');
      setDialogType('error');
      setShowDialog(true);
      return;
    }

    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        // Use the updated API endpoint
        await PostsAPI.removeBookmark(post._id);
        // Update the post in state by removing user ID from bookmarks
        post.bookmarks = post.bookmarks?.filter(id => id !== user._id) || [];
        setDialogMessage('Post removed from bookmarks');
      } else {
        // Use the updated API endpoint
        await PostsAPI.bookmarkPost(post._id);
        // Update the post in state by adding user ID to bookmarks
        post.bookmarks = [...(post.bookmarks || []), user._id];
        setDialogMessage('Post added to bookmarks');
      }
      // Show success message
      setDialogType('success');
      setShowDialog(true);
      // Force a re-render
      setShowOptions(showOptions);
    } catch (error: any) {
      setDialogMessage(error.response?.data?.msg || 'Failed to bookmark post');
      setDialogType('error');
      setShowDialog(true);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    tap: { scale: 0.98 }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      {/* Notification Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className={`p-4 ${dialogType === 'success' ? 'bg-green-50' : 'bg-red-50'} flex items-center`}>
              {dialogType === 'success' ? (
                <FiCheck className="text-green-500 text-xl mr-2" />
              ) : (
                <FiX className="text-red-500 text-xl mr-2" />
              )}
              <h3 className={`font-medium ${dialogType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {dialogType === 'success' ? 'Success' : 'Error'}
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700">{dialogMessage}</p>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <motion.div 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        variants={cardVariants}
      >
        {/* Post Header */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <Link href={`/profile/${post.user._id}`} className="flex-shrink-0">
                {post.user.profileImage ? (
                  <img
                    src={post.user.profileImage}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden mr-3">
                    <div className="text-sm font-bold">
                      {post.user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </Link>
              
              <div>
              <Link href={`/profile/${post.user._id}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                {post.user.username}
              </Link>
              <div className="flex items-center text-xs text-gray-500">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="mx-1">•</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getPostTypeInfo(post.postType).color}-100 text-${getPostTypeInfo(post.postType).color}-700`}>
                  {getPostTypeInfo(post.postType).icon} {getPostTypeInfo(post.postType).label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiMoreHorizontal className="text-gray-500" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
                {isOwnPost && (
                  <button
                    onClick={handleDeletePost}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Delete Post
                  </button>
                )}
                <button
                  onClick={handleBookmark}
                  className="w-full text-left px-4 py-2 flex items-center transition-colors hover:bg-gray-50"
                >
                  <FiBookmark className={`mr-2 ${isBookmarked ? 'text-yellow-500' : 'text-gray-500'}`} />
                  {isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Post Content */}
        <div className="mb-3">
          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        </div>
        
        {/* Post Image */}
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img src={post.image} alt="Post" className="w-full h-auto object-cover" />
          </div>
        )}
        
        {/* Post Location */}
        {post.location && post.location.name && (
          <div className="flex items-center text-gray-600 mb-4 bg-gray-50 px-3 py-2 rounded-lg">
            <FiMapPin className="mr-2 text-blue-500" />
            <span>{post.location.name}</span>
          </div>
        )}
        
        {/* Post Actions */}
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLike}
              className={`flex items-center ${isLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} transition-colors group`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className={`relative p-1.5 rounded-full ${isLiked ? 'bg-blue-50' : 'group-hover:bg-blue-50'} transition-colors`}>
                {isLiked ? <FaThumbsUp /> : <FiHeart />}
              </div>
              <span className="text-sm">{post.likes.length > 0 ? post.likes.length : ''}</span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="relative p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                <FiMessageCircle />
              </div>
              <span className="text-sm">{post.replies.length > 0 ? post.replies.length : ''}</span>
            </motion.button>
            
            <motion.button
              onClick={handleBookmark}
              className={`flex items-center ${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'} transition-colors group`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className={`relative p-1.5 rounded-full ${isBookmarked ? 'bg-yellow-50' : 'group-hover:bg-yellow-50'} transition-colors`}>
                <FiBookmark />
              </div>
              <span className="text-sm">{isBookmarked ? 'Saved' : ''}</span>
            </motion.button>
            
            <motion.button
              onClick={handleDislike}
              className={`flex items-center ${isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors group`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className={`relative p-1.5 rounded-full ${isDisliked ? 'bg-red-50' : 'group-hover:bg-red-50'} transition-colors`}>
                <FaThumbsDown />
              </div>
              <span className="text-sm">{post.dislikes.length > 0 ? post.dislikes.length : ''}</span>
            </motion.button>
            
            <motion.button 
              className="flex items-center text-gray-500 hover:text-green-500 transition-colors group"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="relative p-1.5 rounded-full group-hover:bg-green-50 transition-colors">
                <FiShare2 />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Replies Section */}
      {showReplies && (
        <div className="p-4 pt-0 mt-3 border-t border-gray-100">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium mb-3"
          >
            {showReplyForm ? 'Cancel Reply' : 'Write a reply...'}
          </button>
          
          {showReplyForm && (
            <form onSubmit={handleReply} className="mb-4">
              <div className="flex items-start space-x-2">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden">
                    <div className="text-xs font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    placeholder="Write your reply..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full shadow-sm transition-colors ${submittingReply ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={submittingReply}
                    >
                      {submittingReply ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : 'Post Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {post.replies.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {post.replies.map((reply) => (
                <div key={reply._id} className="flex items-start space-x-2">
                  <Link href={`/profile/${reply.user._id}`} className="flex-shrink-0">
                    {reply.user.profileImage ? (
                      <img
                        src={reply.user.profileImage}
                        alt={reply.user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden">
                        <div className="text-xs font-bold">
                          {reply.user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Link href={`/profile/${reply.user._id}`} className="font-semibold text-sm text-gray-800 hover:text-blue-600 transition-colors">
                          {reply.user.username}
                        </Link>
                        <span className="mx-1 text-gray-400 text-xs">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <div className="text-center">
                <FiMessageCircle className="mx-auto text-2xl mb-2 text-gray-400" />
                <p className="text-sm">No replies yet. Start the conversation!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
    </>
  );
};

export default PostCard;
