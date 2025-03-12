import React from "react";
import { Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 5, backgroundColor: "#2e51a2", color: "#fff", borderRadius: 2 }}>
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

      {/* Trending Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Trending Now
        </Typography>
        <Grid container spacing={3}>
          {/* Dummy Data for Trending Items */}
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://placehold.co/300x400?text=Item+${item}`}
                  alt="Trending Item"
                />
                <CardContent>
                  <Typography variant="h6">Title {item}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    A short description of the book/anime/game.
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Navigation Section */}
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button variant="contained" color="primary" component={Link} to="/top5" sx={{ mx: 1 }}>
          Top 5 Rankings
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/forum" sx={{ mx: 1 }}>
          Join the Forum
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
