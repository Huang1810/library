import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';

const Home = () => {
  const [anime, setAnime] = useState([]);
  const [books, setBooks] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animeRes, booksRes, gamesRes] = await Promise.all([
          API.get('/anime'),
          API.get('/books'),
          API.get('/games'),
        ]);
        setAnime(animeRes.data.slice(0, 5));
        setBooks(booksRes.data.slice(0, 5));
        setGames(gamesRes.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const Section = ({ title, items, category }) => (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2e51a2' }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id || item.externalId}>
            <Card sx={{ borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={item.coverImage || 'https://placehold.co/300x400'}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" component={Link} to={`/${category}/${item.externalId}`} sx={{ color: '#2e51a2', textDecoration: 'none' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description?.substring(0, 100) || 'No description available'}...
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }} component={Link} to={`/${category}/${item.externalId}`}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 5, backgroundColor: '#2e51a2', color: '#fff', borderRadius: 2 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to MyLibraryList
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Track, rate, and discuss your favorite Novels, Anime, and Games!
        </Typography>
        <Button variant="contained" color="secondary" component={Link} to="/library">
          Explore Library
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Section title="Trending Anime" items={anime} category="anime" />
          <Section title="Trending Novels" items={books} category="books" />
          <Section title="Trending Games" items={games} category="games" />
        </>
      )}

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Button variant="contained" sx={{ mx: 1, backgroundColor: '#2e51a2' }} component={Link} to="/top5">
          Top 5 Rankings
        </Button>
        <Button variant="contained" sx={{ mx: 1, backgroundColor: '#2e51a2' }} component={Link} to="/forum">
          Join the Forum
        </Button>
      </Box>
    </Container>
  );
};

export default Home;