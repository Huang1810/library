const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteProfile, addToList, removeFromList } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteProfile);
router.post('/list', authMiddleware, addToList);
router.delete('/list', authMiddleware, removeFromList); // Body: { itemId }

module.exports = router;