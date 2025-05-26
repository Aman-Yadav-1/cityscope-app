import axios from 'axios';

// Set base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

// Posts API
export const PostsAPI = {
  // Get all posts with optional filtering
  getPosts: async (page = 1, limit = 10, filter = {}) => {
    const { postType, location } = filter as any;
    let url = `/posts?page=${page}&limit=${limit}`;
    
    if (postType) {
      url += `&postType=${postType}`;
    }
    
    if (location) {
      url += `&location=${location}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  },
  
  // Get post by ID
  getPostById: async (id: string) => {
    const response = await axios.get(`/posts/${id}`);
    return response.data;
  },
  
  // Create a new post
  createPost: async (postData: any) => {
    const response = await axios.post('/posts', postData);
    return response.data;
  },
  
  // Delete a post
  deletePost: async (id: string) => {
    const response = await axios.delete(`/posts/${id}`);
    return response.data;
  },
  
  // Add a reply to a post
  addReply: async (postId: string, content: string) => {
    const response = await axios.post(`/posts/${postId}/reply`, { content });
    return response.data;
  },
  
  // Like a post
  likePost: async (id: string) => {
    const response = await axios.put(`/posts/${id}/like`);
    return response.data;
  },
  
  // Dislike a post
  dislikePost: async (id: string) => {
    const response = await axios.put(`/posts/${id}/dislike`);
    return response.data;
  },
  
  // Get bookmarked posts
  getBookmarkedPosts: async (page = 1, limit = 10) => {
    const response = await axios.get(`/posts?page=${page}&limit=${limit}&filter=bookmarked`);
    return response.data;
  },
  
  // Bookmark a post
  bookmarkPost: async (id: string) => {
    const response = await axios.put(`/posts/${id}/bookmark`);
    return response.data;
  },
  
  // Remove bookmark from a post
  removeBookmark: async (id: string) => {
    const response = await axios.delete(`/posts/${id}/bookmark`);
    return response.data;
  },
  
  // Get nearby posts based on location
  getNearbyPosts: async (page = 1, limit = 10, locationName = '') => {
    // Use query parameters instead of route parameters to avoid ObjectId validation
    let url = `/posts?page=${page}&limit=${limit}&filter=nearby`;
    
    if (locationName) {
      url += `&location=${encodeURIComponent(locationName)}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  }
};

// Users API
export const UsersAPI = {
  // Get user profile by ID
  getUserProfile: async (id: string) => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },
  
  // Get posts by user ID
  getUserPosts: async (id: string, page = 1, limit = 10) => {
    const response = await axios.get(`/users/${id}/posts?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await axios.put('/users/profile', profileData);
    return response.data;
  }
};
