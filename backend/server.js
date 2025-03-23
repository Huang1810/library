const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();


connectDB();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Library API! Use /api/books, /api/anime, /api/games, /api/user, or /api/forum to interact with the API.' });
});


app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/anime', require('./routes/animeRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
