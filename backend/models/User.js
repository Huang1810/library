const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profileImage: { type: String, default: 'default.jpg' },
  list: [{
    item: { type: mongoose.Schema.Types.ObjectId, refPath: 'list.itemModel' },
    itemModel: { type: String, enum: ['Book', 'Anime', 'Game'] }
  }]
});

module.exports = mongoose.model('User', userSchema);