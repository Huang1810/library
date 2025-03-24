const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, listController.createList);
router.get('/', authMiddleware, listController.getUserLists);
router.post('/add', authMiddleware, listController.addToList);
router.delete('/:listId/item/:itemId', authMiddleware, listController.removeFromList);
router.delete('/:listId', authMiddleware, listController.deleteList);

module.exports = router;