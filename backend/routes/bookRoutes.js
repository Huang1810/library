const express = require('express');
const router = express.Router();
const { getBooks, getBook, addRating, updateRating, deleteRating, addReview, updateReview, deleteReview, updateBook, deleteBook, getTop5 } = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

router.get('/', getBooks);
router.get('/:externalId', getBook);
router.post('/rating', authMiddleware, addRating);
router.put('/rating', authMiddleware, updateRating); 
router.delete('/:externalId/rating/:ratingId', authMiddleware, deleteRating);
router.post('/review', authMiddleware, addReview);
router.put('/review', authMiddleware, updateReview); 
router.delete('/:externalId/review/:reviewId', authMiddleware, deleteReview);
router.put('/:externalId', authMiddleware, updateBook);
router.delete('/:externalId', authMiddleware, deleteBook);
router.get('/top5', getTop5);

module.exports = router;