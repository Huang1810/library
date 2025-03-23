const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  authors: [{ type: String, required: true }],
  genre: { type: String },
  description: { type: String },
  coverImage: { type: String },
  publishedDate: { type: String },
  isbn: { type: String },
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String }, // Added this
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }],
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String }, // Added this
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  category: { type: String, default: 'Novels', immutable: true }
});

BookSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((acc, cur) => acc + cur.rating, 0);
  return parseFloat((total / this.ratings.length).toFixed(2));
});

BookSchema.set('toJSON', { virtuals: true });
BookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', BookSchema);