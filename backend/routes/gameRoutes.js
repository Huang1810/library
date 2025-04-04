const express = require('express');
const router = express.Router();
const { getGames, getGame, addRating, updateRating, deleteRating, addReview, updateReview, deleteReview, updateGame, deleteGame, getTop5 } = require('../controllers/gameController');
const authMiddleware = require('../middleware/auth');

router.get('/', getGames);
router.get('/:externalId', getGame);
router.post('/rating', authMiddleware, addRating);
router.put('/rating', authMiddleware, updateRating); 
router.delete('/:externalId/rating/:ratingId', authMiddleware, deleteRating);
router.post('/review', authMiddleware, addReview);
router.put('/review', authMiddleware, updateReview); 
router.delete('/:externalId/review/:reviewId', authMiddleware, deleteReview);
router.put('/:externalId', authMiddleware, updateGame);
router.delete('/:externalId', authMiddleware, deleteGame);

module.exports = router;
