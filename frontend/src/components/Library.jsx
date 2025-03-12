import React, { useState, useEffect } from 'react';
import API from '../api';
import { Grid, Card, CardMedia, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Library = () => {
  const [category, setCategory] = useState('books');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const endpoint = `/${category}${searchQuery ? `?query=${searchQuery}` : ''}`;
      const response = await API.get(endpoint);
      console.log(`Fetched ${category}:`, response.data);
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${category}:`, error.response?.data || error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  const handleSearch = () => {
    fetchItems();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Library</Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={e => setCategory(e.target.value)}>
            <MenuItem value="books">Novels</MenuItem>
            <MenuItem value="anime">Anime</MenuItem>
            <MenuItem value="games">Games</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <Grid container spacing={2}>
        {items.length > 0 ? (
          items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.externalId}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.coverImage || 'https://via.placeholder.com/200'}
                  alt={item.title}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/library/${category}/${item.externalId}`} // Updated path
                    sx={{ textDecoration: 'none', color: '#2e51a2' }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No items found</Typography>
        )}
      </Grid>
    </div>
  );
};

export default Library;