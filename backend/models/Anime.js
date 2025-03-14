const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  studio: { type: String, required: true },
  genre: [{ type: String }],
  description: { type: String },
  coverImage: { type: String },
  episodes: { type: Number },
  airingStatus: { type: String },
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }],
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  category: { type: String, default: 'Anime', immutable: true }
});

AnimeSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((acc, cur) => acc + cur.rating, 0);
  return parseFloat((total / this.ratings.length).toFixed(2));
});

AnimeSchema.set('toJSON', { virtuals: true });
AnimeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Anime', AnimeSchema);