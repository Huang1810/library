const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, updatePost, deletePost, addReply, updateReply, deleteReply } = require('../controllers/forumController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/:postId', getPost);
router.put('/:postId', authMiddleware, updatePost);
router.delete('/:postId', authMiddleware, deletePost);
router.post('/:postId/reply', authMiddleware, addReply);
router.put('/:postId/reply', authMiddleware, updateReply); 
router.delete('/:postId/reply/:replyId', authMiddleware, deleteReply);

module.exports = router;