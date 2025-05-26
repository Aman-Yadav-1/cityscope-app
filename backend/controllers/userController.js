const User = require('../models/User');
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

// Get posts by user ID
exports.getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'username profileImage')
      .populate('replies.user', 'username profileImage');
    
    const total = await Post.countDocuments({ user: req.params.id });
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { bio, profileImage, location } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (bio) profileFields.bio = bio;
    if (profileImage) profileFields.profileImage = profileImage;
    if (location) profileFields.location = location;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
