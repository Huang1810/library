const axios = require('axios');
const Book = require('../models/Book');
const User = require('../models/User');

exports.getBooks = async (req, res) => {
  const { query } = req.query;
  try {
    let books = [];
    if (query) {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
      );
      books = response.data.items.map(book => ({
        externalId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Unknown'],
        genre: book.volumeInfo.categories?.[0],
        description: book.volumeInfo.description || 'No description available',
        coverImage: book.volumeInfo.imageLinks?.thumbnail || '',
        publishedDate: book.volumeInfo.publishedDate,
        isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier,
        ratings: [],
        reviews: []
      }));
      for (const book of books) {
        await Book.findOneAndUpdate({ externalId: book.externalId }, book, { upsert: true });
      }
    } else {
      books = await Book.find();
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBook = async (req, res) => {
  const { externalId } = req.params;
  try {
    const book = await Book.findOne({ externalId }).populate('ratings.userId reviews.userId', 'username');
    if (!book) {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${externalId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
      );
      const newBook = await Book.create({
        externalId,
        title: response.data.volumeInfo.title,
        authors: response.data.volumeInfo.authors || ['Unknown'],
        genre: response.data.volumeInfo.categories?.[0],
        description: response.data.volumeInfo.description,
        coverImage: response.data.volumeInfo.imageLinks?.thumbnail,
        publishedDate: response.data.volumeInfo.publishedDate,
        isbn: response.data.volumeInfo.industryIdentifiers?.[0]?.identifier,
        ratings: [],
        reviews: []
      });
      return res.json(newBook);
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRating = async (req, res) => {
  const { externalId, rating } = req.body;
  try {
    const book = await Book.findOne({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const user = await User.findById(req.user.id).select('username');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    book.ratings.push({ userId: req.user.id, username: user.username, rating });
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRating = async (req, res) => {
  const { externalId, ratingId, rating } = req.body;
  try {
    const book = await Book.findOne({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const userRating = book.ratings.id(ratingId);
    if (!userRating || userRating.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Rating not found or unauthorized' });
    }
    userRating.rating = rating;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  const { externalId, ratingId } = req.params;
  try {
    const book = await Book.findOne({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const userRating = book.ratings.id(ratingId);
    if (!userRating || userRating.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Rating not found or unauthorized' });
    }
    book.ratings.pull(ratingId);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { externalId, comment } = req.body;
  try {
    const book = await Book.findOne({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const user = await User.findById(req.user.id).select('username');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    book.reviews.push({ userId: req.user.id, username: user.username, comment });
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { externalId, reviewId, comment } = req.body;
  try {
    const book = await Book.findOne({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const userReview = book.reviews.id(reviewId);
    if (!userReview || userReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Review not found or unauthorized' });
    }
    userReview.comment = comment;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { externalId, reviewId } = req.params;
  try {
    const book = await Book.findOne({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const userReview = book.reviews.id(reviewId);
    if (!userReview || userReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Review not found or unauthorized' });
    }
    book.reviews.pull(reviewId);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { externalId } = req.params;
  const { title, authors, genre, description, coverImage, publishedDate, isbn } = req.body;
  try {
    const book = await Book.findOneAndUpdate(
      { externalId },
      { title, authors, genre, description, coverImage, publishedDate, isbn },
      { new: true }
    );
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { externalId } = req.params;
  try {
    const book = await Book.findOneAndDelete({ externalId });
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json({ msg: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
