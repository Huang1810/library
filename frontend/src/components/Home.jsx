import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent, AppBar, Toolbar, Skeleton } from '@mui/material';

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
        // Debug the API response to inspect the coverImage field
        console.log('Anime Response:', animeRes.data);
        console.log('Books Response:', booksRes.data);
        console.log('Games Response:', gamesRes.data);

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

  // Section component for displaying trending items
  const Section = ({ title, items, category }) => (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2e51a2', textAlign: 'center' }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id || item.externalId}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : item.coverImage ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.coverImage}
                  alt={item.title}
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide the image if it fails to load
                    console.log(`Failed to load image for ${item.title}: ${item.coverImage}`);
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
                  No image available
                </Typography>
              )}
              <CardContent>
                <Typography variant="h6" sx={{ color: '#2e51a2' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description?.substring(0, 100) || 'No description available'}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <>
      {/* Header with Navigation */}
      <AppBar position="sticky" sx={{ backgroundColor: '#2e51a2' }}>
        <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MyLibraryList
          </Typography>
          <Box>
            <Button color="inherit" href="#features">
              Features
            </Button>
            <Button color="inherit" href="#about">
              About
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Image Section (Using the "Discuss in the Forum" Image) */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '500px', // Adjust height as needed
          backgroundColor: '#f4f4f4',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=500&q=80"
          alt="MyLibraryList Hero Image"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.style.display = 'none'; // Hide the image if it fails to load
            console.log('Failed to load hero image');
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            Welcome to MyLibraryList
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Your Ultimate Hub for Novels, Anime, and Games
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        {/* Intro Section with Cover Image */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: '#f4f4f4',
            borderRadius: 2,
            mt: 2,
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd66b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
            alt="MyLibraryList Cover"
            sx={{ width: '100%', maxWidth: '800px', height: 'auto', mb: 3, borderRadius: 2 }}
            onError={(e) => {
              e.target.style.display = 'none'; // Hide the image if it fails to load
              console.log('Failed to load cover image');
            }}
          />
          <Typography variant="h2" gutterBottom sx={{ color: '#2e51a2' }}>
            MyLibraryList
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#666' }}>
            Track, rate, and discuss your favorite Novels, Anime, and Games!
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#2e51a2', '&:hover': { backgroundColor: '#1e3a8a' } }}
            href="https://mylibrarylist-deployed-app.com"
            target="_blank"
          >
            Visit the App
          </Button>
        </Box>

        {/* Feature Section */}
        <Box id="features" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 5, color: '#2e51a2', fontWeight: 'bold' }}>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {/* Feature 1: Track Your Favorites */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1516321318423-9b5a0a61c579?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
                  alt="Track Feature"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide the image if it fails to load
                    console.log('Failed to load Track Feature image');
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2e51a2', mb: 1 }}>
                    Track Your Favorites
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add novels, anime, and games to your library and keep track of your progress.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Feature 2: Rate and Review */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
                  alt="Rate Feature"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide the image if it fails to load
                    console.log('Failed to load Rate Feature image');
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2e51a2', mb: 1 }}>
                    Rate and Review
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rate your favorite items and share your thoughts with the community.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Feature 3: Discuss in the Forum */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
                  alt="Discuss Feature"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide the image if it fails to load
                    console.log('Failed to load Discuss Feature image');
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2e51a2', mb: 1 }}>
                    Discuss in the Forum
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Join discussions with other fans in the MyLibraryList forum.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Trending Sections (Dynamic Data from API) */}
        {loading ? (
          <Box sx={{ textAlign: 'center', my: 5 }}>
            <Skeleton variant="text" width={200} sx={{ mx: 'auto', mb: 2 }} />
            <Grid container spacing={3}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={200} />
                  <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="60%" />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <>
            <Section title="Trending Anime" items={anime} category="anime" />
            <Section title="Trending Novels" items={books} category="books" />
            <Section title="Trending Games" items={games} category="games" />
          </>
        )}

        {/* About Section */}
        <Box id="about" sx={{ py: 8, backgroundColor: '#f4f4f4', borderRadius: 2 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 3, color: '#2e51a2', fontWeight: 'bold' }}>
            About MyLibraryList
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 3, color: '#666' }}>
            MyLibraryList was inspired by my lifelong passion for storytelling across different mediums—novels, anime, and games. As someone who grew up immersed in fantasy worlds, I wanted to create a platform where fans like me could organize their collections, share their opinions, and connect with others. I started this project in early 2025 as part of my Portfolio Project for{' '}
            <a href="https://www.holbertonschool.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2e51a2' }}>
              Holberton School
            </a>
            , where I honed my skills in full-stack development using the MERN stack.
          </Typography>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, color: '#2e51a2' }}>
            About the Developer
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 2, color: '#666', textAlign: 'center' }}>
            Hi, I’m [Your Name], a full-stack developer passionate about building user-friendly applications. Connect with me on:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              sx={{ color: '#2e51a2', borderColor: '#2e51a2' }}
            >
              LinkedIn
            </Button>
            <Button
              variant="outlined"
              href="https://github.com/your-username"
              target="_blank"
              sx={{ color: '#2e51a2', borderColor: '#2e51a2' }}
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              href="https://twitter.com/your-username"
              target="_blank"
              sx={{ color: '#2e51a2', borderColor: '#2e51a2' }}
            >
              Twitter
            </Button>
          </Box>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            Check out the source code for MyLibraryList on{' '}
            <a
              href="https://github.com/your-username/mylibrarylist"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2e51a2' }}
            >
              GitHub
            </a>
            .
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 3, textAlign: 'center', backgroundColor: '#2e51a2', color: '#fff', borderRadius: 2 }}>
          <Typography variant="body2">
            © 2025 MyLibraryList. Created by [Your Name].
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;