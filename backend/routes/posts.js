const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', postController.getPosts);

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', postController.getPostById);

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('content', 'Content is required').not().isEmpty(),
      check('content', 'Content cannot exceed 280 characters').isLength({ max: 280 }),
      check('postType', 'Post type is required').isIn([
        'recommend_place',
        'ask_help',
        'local_update',
        'event_announcement'
      ])
    ]
  ],
  postController.createPost
);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, postController.deletePost);

// @route   POST api/posts/:id/reply
// @desc    Add a reply to a post
// @access  Private
router.post(
  '/:id/reply',
  [
    auth,
    [
      check('content', 'Content is required').not().isEmpty(),
      check('content', 'Content cannot exceed 280 characters').isLength({ max: 280 })
    ]
  ],
  postController.addReply
);

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put('/:id/like', auth, postController.likePost);

// @route   PUT api/posts/:id/dislike
// @desc    Dislike a post
// @access  Private
router.put('/:id/dislike', auth, postController.dislikePost);

module.exports = router;
