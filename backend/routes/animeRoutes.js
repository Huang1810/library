const express = require('express');
const router = express.Router();
const { getAnime, getAnimeById, addRating, updateRating, deleteRating, addReview, updateReview, deleteReview, updateAnime, deleteAnime, getTop5, addAnime } = require('../controllers/animeController');
const authMiddleware = require('../middleware/auth');


router.post('/add', authMiddleware, addAnime);

router.get('/', getAnime);
router.get('/:externalId', getAnimeById);
router.post('/rating', authMiddleware, addRating);
router.put('/rating', authMiddleware, updateRating); 
router.delete('/:externalId/rating/:ratingId', authMiddleware, deleteRating);
router.post('/review', authMiddleware, addReview);
router.put('/review', authMiddleware, updateReview); 
router.delete('/:externalId/review/:reviewId', authMiddleware, deleteReview);
router.put('/:externalId', authMiddleware, updateAnime);
router.delete('/:externalId', authMiddleware, deleteAnime);

module.exports = router;
