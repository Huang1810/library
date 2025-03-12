import React, { useState, useEffect } from 'react';
import API from '../api';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, TextField, List, ListItem, ListItemText, CardMedia, Divider } from '@mui/material';

const ItemDetail = () => {
  const { category, externalId } = useParams();
  const [item, setItem] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    API.get(`/${category}/${externalId}`)
      .then(response => setItem(response.data))
      .catch(error => console.error('Error fetching item:', error));
  }, [category, externalId]);

  const handleRating = () => {
    API.post(`/${category}/rating`, { externalId, rating })
      .then(response => {
        setItem(response.data);
        setRating('');
      })
      .catch(error => console.error('Error submitting rating:', error));
  };

  const handleComment = () => {
    API.post(`/${category}/review`, { externalId, comment })
      .then(response => {
        setItem(response.data);
        setComment('');
      })
      .catch(error => console.error('Error submitting comment:', error));
  };

  const handleAddToList = () => {
    const model = category.charAt(0).toUpperCase() + category.slice(1, -1);
    API.post('/user/list', { externalId, model })
      .then(() => alert('Added to list'))
      .catch(error => console.error('Error adding to list:', error));
  };

  if (!item) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 200, height: 300, mr: 3 }}
          image={item.coverImage || 'https://via.placeholder.com/200x300'}
          alt={item.title}
        />
        <Box>
          <Typography variant="h4">{item.title}</Typography>
          {category === 'books' && (
            <>
              <Typography>Author(s): {item.authors?.join(', ') || 'Unknown'}</Typography>
              <Typography>Published: {item.publishedDate || 'N/A'}</Typography>
              <Typography>ISBN: {item.isbn || 'N/A'}</Typography>
            </>
          )}
          {category === 'anime' && (
            <>
              <Typography>Studio: {item.studio || 'Unknown'}</Typography>
              <Typography>Episodes: {item.episodes || 'N/A'}</Typography>
              <Typography>Status: {item.airingStatus || 'N/A'}</Typography>
            </>
          )}
          {category === 'games' && (
            <>
              <Typography>Developer: {item.developer || 'Unknown'}</Typography>
              <Typography>Release Date: {item.releaseDate || 'N/A'}</Typography>
              <Typography>Platforms: {item.platforms?.join(', ') || 'N/A'}</Typography>
            </>
          )}
          <Typography>Genre: {Array.isArray(item.genre) ? item.genre.join(', ') : item.genre || 'N/A'}</Typography>
          <Button variant="contained" color="primary" onClick={handleAddToList} sx={{ mt: 2 }}>
            Add to List
          </Button>
        </Box>
      </Box>
      <Typography variant="h6">Description</Typography>
      <Typography sx={{ mb: 3 }}>{item.description || 'No description available'}</Typography>
      <Divider />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Rate This {category.slice(0, -1)}</Typography>
        <TextField
          label="Rating (1-5)"
          type="number"
          value={rating}
          onChange={e => setRating(e.target.value)}
          inputProps={{ min: 1, max: 5 }}
          sx={{ width: 100, mr: 2 }}
        />
        <Button variant="contained" onClick={handleRating}>Submit</Button>
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        Average Rating: {item.averageRating || 'N/A'}
      </Typography>
      <List>
        {item.ratings.map(r => (
          <ListItem key={r._id}>
            <ListItemText primary={`${r.userId.username}: ${r.rating}`} secondary={new Date(r.createdAt).toLocaleDateString()} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Comments</Typography>
        <TextField
          label="Add a Comment"
          multiline
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleComment}>Submit</Button>
      </Box>
      <List>
        {item.reviews.map(r => (
          <ListItem key={r._id}>
            <ListItemText primary={`${r.userId.username}: ${r.comment}`} secondary={new Date(r.createdAt).toLocaleDateString()} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ItemDetail;