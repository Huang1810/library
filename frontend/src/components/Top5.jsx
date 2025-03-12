import React, { useState, useEffect } from "react";
import API from "../api";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const Top5 = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [topGames, setTopGames] = useState([]);

  useEffect(() => {
    const fetchTop5 = async () => {
      try {
        const [booksRes, animeRes, gamesRes] = await Promise.all([
          API.get("/books/top5"),
          API.get("/anime/top5"),
          API.get("/games/top5"),
        ]);
        setTopBooks(booksRes.data);
        setTopAnime(animeRes.data);
        setTopGames(gamesRes.data);
      } catch (error) {
        console.error("Error fetching top 5:", error);
      }
    };
    fetchTop5();
  }, []);

  const renderTop5Section = (title, data, category) => (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.externalId}>
            <Card sx={{ borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="250"
                image={item.image || `https://placehold.co/300x400?text=${item.title}`}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6">
                  #{index + 1}{" "}
                  <Link to={`/${category}/${item.externalId}`} style={{ textDecoration: "none", color: "#2e51a2" }}>
                    {item.title}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {item.averageRating ? item.averageRating.toFixed(1) : "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
        Top 5 Rankings
      </Typography>
      {renderTop5Section("Top 5 Novels", topBooks, "books")}
      {renderTop5Section("Top 5 Anime", topAnime, "anime")}
      {renderTop5Section("Top 5 Games", topGames, "games")}
    </Box>
  );
};

export default Top5;
