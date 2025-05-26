const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', userController.getUserProfile);

// @route   GET api/users/:id/posts
// @desc    Get posts by user ID
// @access  Public
router.get('/:id/posts', userController.getUserPosts);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
    [
      check('bio', 'Bio cannot exceed 160 characters').isLength({ max: 160 })
    ]
  ],
  userController.updateProfile
);

module.exports = router;
