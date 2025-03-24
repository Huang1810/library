const axios = require('axios');
const Anime = require('../models/Anime');
const User = require('../models/User');

exports.getAnime = async (req, res) => {
  const { query } = req.query;
  try {
    let animeList = [];
    if (query) {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
      animeList = response.data.data.map(anime => ({
        externalId: anime.mal_id.toString(),
        title: anime.title,
        studio: anime.studios?.[0]?.name || 'Unknown',
        genre: anime.genres.map(g => g.name),
        description: anime.synopsis,
        coverImage: anime.images.jpg.image_url,
        episodes: anime.episodes,
        airingStatus: anime.status,
        ratings: [],
        reviews: []
      }));
      for (const anime of animeList) {
        await Anime.findOneAndUpdate({ externalId: anime.externalId }, anime, { upsert: true });
      }
    } else {
      animeList = await Anime.find();
    }
    res.json(animeList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnimeById = async (req, res) => {
  const { externalId } = req.params;
  try {
    const anime = await Anime.findOne({ externalId }).populate('ratings.userId reviews.userId', 'username');
    if (!anime) {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${externalId}`);
      const newAnime = await Anime.create({
        externalId,
        title: response.data.data.title,
        studio: response.data.data.studios?.[0]?.name || 'Unknown',
        genre: response.data.data.genres.map(g => g.name),
        description: response.data.data.synopsis,
        coverImage: response.data.data.images.jpg.image_url,
        episodes: response.data.data.episodes,
        airingStatus: response.data.data.status,
        ratings: [],
        reviews: []
      });
      return res.json(newAnime);
    }
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAnime = async (req, res) => {
  const { externalId, title, description, studio, genre, coverImage, episodes, airingStatus } = req.body;
  try {
    const newAnime = new Anime({
      externalId,
      title,
      description,
      studio: studio || 'Unknown',
      genre: genre || [],
      coverImage: coverImage || '',
      episodes: episodes || 0,
      airingStatus: airingStatus || 'Unknown',
      ratings: [],
      reviews: []
    });
    await newAnime.save();
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRating = async (req, res) => {
  const { externalId, rating } = req.body;
  try {
    const anime = await Anime.findOne({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });

    const user = await User.findById(req.user.id).select('username');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    anime.ratings.push({ userId: req.user.id, username: user.username, rating });
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRating = async (req, res) => {
  const { externalId, ratingId, rating } = req.body;
  try {
    const anime = await Anime.findOne({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });

    const userRating = anime.ratings.id(ratingId);
    if (!userRating || userRating.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Rating not found or unauthorized' });
    }
    userRating.rating = rating;
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  const { externalId, ratingId } = req.params;
  try {
    const anime = await Anime.findOne({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });

    const userRating = anime.ratings.id(ratingId);
    if (!userRating || userRating.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Rating not found or unauthorized' });
    }
    anime.ratings.pull(ratingId);
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { externalId, comment } = req.body;
  try {
    const anime = await Anime.findOne({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });

    const user = await User.findById(req.user.id).select('username');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    anime.reviews.push({ userId: req.user.id, username: user.username, comment });
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { externalId, reviewId, comment } = req.body;
  try {
    const anime = await Anime.findOne({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });

    const userReview = anime.reviews.id(reviewId);
    if (!userReview || userReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Review not found or unauthorized' });
    }
    userReview.comment = comment;
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { externalId, reviewId } = req.params;
  try {
    const anime = await Anime.findOne({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });

    const userReview = anime.reviews.id(reviewId);
    if (!userReview || userReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Review not found or unauthorized' });
    }
    anime.reviews.pull(reviewId);
    await anime.save();
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnime = async (req, res) => {
  const { externalId } = req.params;
  const { title, studio, genre, description, coverImage, episodes, airingStatus } = req.body;
  try {
    const anime = await Anime.findOneAndUpdate(
      { externalId },
      { title, studio, genre, description, coverImage, episodes, airingStatus },
      { new: true }
    );
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });
    res.json(anime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAnime = async (req, res) => {
  const { externalId } = req.params;
  try {
    const anime = await Anime.findOneAndDelete({ externalId });
    if (!anime) return res.status(404).json({ msg: 'Anime not found' });
    res.json({ msg: 'Anime deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
