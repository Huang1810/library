const axios = require('axios');
const Game = require('../models/Game');

exports.getGames = async (req, res) => {
  const { query } = req.query;
  try {
    let games = [];
    if (query) {
      const response = await axios.get(
        `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${query}`
      );
      games = response.data.results.map(game => ({
        externalId: game.id.toString(),
        title: game.name,
        developer: game.developers?.[0]?.name || 'Unknown',
        genre: game.genres.map(g => g.name),
        description: game.description_raw || 'No description available',
        coverImage: game.background_image || '',
        releaseDate: game.released,
        platforms: game.platforms.map(p => p.platform.name),
        ratings: [],
        reviews: []
      }));
      for (const game of games) {
        await Game.findOneAndUpdate({ externalId: game.externalId }, game, { upsert: true });
      }
    } else {
      games = await Game.find();
    }
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGame = async (req, res) => {
  const { externalId } = req.params;
  try {
    const game = await Game.findOne({ externalId }).populate('ratings.userId reviews.userId', 'username');
    if (!game) {
      const response = await axios.get(
        `https://api.rawg.io/api/games/${externalId}?key=${process.env.RAWG_API_KEY}`
      );
      const newGame = await Game.create({
        externalId,
        title: response.data.name,
        developer: response.data.developers?.[0]?.name || 'Unknown',
        genre: response.data.genres.map(g => g.name),
        description: response.data.description_raw,
        coverImage: response.data.background_image,
        releaseDate: response.data.released,
        platforms: response.data.platforms.map(p => p.platform.name),
        ratings: [],
        reviews: []
      });
      return res.json(newGame);
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRating = async (req, res) => {
  const { externalId, rating } = req.body;
  try {
    const game = await Game.findOne({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    game.ratings.push({ userId: req.user.id, rating });
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRating = async (req, res) => {
  const { externalId, ratingId, rating } = req.body;
  try {
    const game = await Game.findOne({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    const userRating = game.ratings.id(ratingId);
    if (!userRating || userRating.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Rating not found or unauthorized' });
    }
    userRating.rating = rating;
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  const { externalId, ratingId } = req.params;
  try {
    const game = await Game.findOne({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    const userRating = game.ratings.id(ratingId);
    if (!userRating || userRating.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Rating not found or unauthorized' });
    }
    game.ratings.pull(ratingId);
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { externalId, comment } = req.body;
  try {
    const game = await Game.findOne({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    game.reviews.push({ userId: req.user.id, comment });
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { externalId, reviewId, comment } = req.body;
  try {
    const game = await Game.findOne({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    const userReview = game.reviews.id(reviewId);
    if (!userReview || userReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Review not found or unauthorized' });
    }
    userReview.comment = comment;
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { externalId, reviewId } = req.params;
  try {
    const game = await Game.findOne({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    const userReview = game.reviews.id(reviewId);
    if (!userReview || userReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Review not found or unauthorized' });
    }
    game.reviews.pull(reviewId);
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGame = async (req, res) => {
  const { externalId } = req.params;
  const { title, developer, genre, description, coverImage, releaseDate, platforms } = req.body;
  try {
    const game = await Game.findOneAndUpdate(
      { externalId },
      { title, developer, genre, description, coverImage, releaseDate, platforms },
      { new: true }
    );
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGame = async (req, res) => {
  const { externalId } = req.params;
  try {
    const game = await Game.findOneAndDelete({ externalId });
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    res.json({ msg: 'Game deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTop5 = async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const games = await Game.aggregate([
      { $unwind: '$ratings' },
      { $match: { 'ratings.createdAt': { $gte: oneWeekAgo } } },
      { $group: {
        _id: { _id: '$_id', title: '$title', externalId: '$externalId' },
        averageRating: { $avg: '$ratings.rating' },
        ratingCount: { $sum: 1 }
      }},
      { $sort: { averageRating: -1, ratingCount: -1 } },
      { $limit: 5 },
      { $project: { title: '$_id.title', externalId: '$_id.externalId', averageRating: 1 }}
    ]);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};