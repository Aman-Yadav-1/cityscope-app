const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all posts with pagination and filtering
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, postType, location } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Filter by post type if provided
    if (postType) {
      query.postType = postType;
    }
    
    // Filter by location if provided
    if (location) {
      const [longitude, latitude, distance = 10000] = location.split(',').map(Number);
      
      if (!isNaN(longitude) && !isNaN(latitude)) {
        query.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: distance // in meters
          }
        };
      }
    }
    
    // Get posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'username profileImage')
      .populate('replies.user', 'username profileImage');
    
    // Get total count
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profileImage')
      .populate('replies.user', 'username profileImage');
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { content, postType, image, location } = req.body;
    
    // Create new post
    const newPost = new Post({
      user: req.user.id,
      content,
      postType,
      image: image || '',
      location: location || {
        type: 'Point',
        coordinates: [0, 0],
        name: ''
      }
    });
    
    // Save post
    const post = await newPost.save();
    
    // Populate user data
    await post.populate('user', 'username profileImage');
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await post.deleteOne();
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Add a reply to a post
exports.addReply = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    const user = await User.findById(req.user.id).select('username profileImage');
    
    // Create new reply
    const newReply = {
      user: req.user.id,
      content: req.body.content
    };
    
    // Add reply to post
    post.replies.unshift(newReply);
    
    // Save post
    await post.save();
    
    // Return the new reply with populated user data
    const reply = post.replies[0];
    reply.user = user;
    
    res.json(reply);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if post has already been liked by this user
    if (post.likes.some(like => like.toString() === req.user.id)) {
      // Remove like
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Add like
      post.likes.unshift(req.user.id);
      
      // Remove from dislikes if present
      post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== req.user.id);
    }
    
    await post.save();
    
    res.json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Dislike a post
exports.dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if post has already been disliked by this user
    if (post.dislikes.some(dislike => dislike.toString() === req.user.id)) {
      // Remove dislike
      post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== req.user.id);
    } else {
      // Add dislike
      post.dislikes.unshift(req.user.id);
      
      // Remove from likes if present
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    }
    
    await post.save();
    
    res.json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};
