const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: [{
    category: { type: String, enum: ['Games', 'Books', 'Anime'], required: true },
    itemId: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('List', ListSchema);