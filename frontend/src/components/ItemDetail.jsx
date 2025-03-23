import React, { useState, useEffect } from 'react';
import API from '../api';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, TextField, List, ListItem, ListItemText, CardMedia, Divider, Alert } from '@mui/material';

const ItemDetail = () => {
  const { category, externalId } = useParams();
  const [item, setItem] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isInList, setIsInList] = useState(false);
  const loggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemResponse = await API.get(`/${category}/${externalId}`);
        setItem(itemResponse.data);

        if (loggedIn) {
          const userResponse = await API.get('/user/profile');
          const userList = userResponse.data.list || [];
          const model = category === "anime" ? "Anime" : 
                        category.charAt(0).toUpperCase() + category.slice(1, -1); // "Anime", "Book", "Game"
          const isAlreadyInList = userList.some(
            listItem => listItem.itemModel === model && listItem.item.externalId === externalId
          );
          setIsInList(isAlreadyInList);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load item');
        setLoading(false);
      }
    };
    fetchData();
  }, [category, externalId, loggedIn]);

  const handleRating = async () => {
    if (!loggedIn) {
      setError('Please log in to rate');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }
    try {
      const response = await API.post(`/${category}/rating`, { externalId, rating });
      setItem(response.data);
      setRating('');
      setSuccess('Rating submitted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error submitting rating');
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!loggedIn) {
      setError('Please log in to comment');
      return;
    }
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    try {
      const response = await API.post(`/${category}/review`, { externalId, comment });
      setItem(response.data);
      setComment('');
      setSuccess('Comment submitted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error submitting comment');
      console.error(err);
    }
  };

  const handleAddToList = async () => {
    if (!loggedIn) {
      setError('Please log in to add to your list');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const model = category === "anime" ? "Anime" : 
                  category.charAt(0).toUpperCase() + category.slice(1, -1); // "Anime", "Book", "Game"
    try {
      const response = await API.post('/user/list', { externalId, model });
      setIsInList(true);
      setSuccess(response.data.msg || 'Added to list');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding to list');
      console.error(err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {item ? (
        <>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <CardMedia
              component="img"
              sx={{ width: 200, height: 300, mr: 3 }}
              image={item.coverImage || 'https://via.placeholder.com/200x300'}
              alt={item.title}
            />
            <Box>
              <Typography variant="h4">{item.title}</Typography>
              {category === 'games' && (
                <>
                  <Typography>Developer: {item.developer || 'Unknown'}</Typography>
                  <Typography>Release Date: {item.releaseDate || 'N/A'}</Typography>
                  <Typography>Platforms: {item.platforms?.join(', ') || 'N/A'}</Typography>
                </>
              )}
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
              <Typography>Genre: {Array.isArray(item.genre) ? item.genre.join(', ') : item.genre || 'N/A'}</Typography>
              {loggedIn && (
                isInList ? (
                  <Typography sx={{ mt: 2, color: 'green' }}>Added</Typography>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleAddToList} sx={{ mt: 2 }}>
                    Add to List
                  </Button>
                )
              )}
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
                <ListItemText primary={`${r.username}: ${r.rating}`} secondary={new Date(r.createdAt).toLocaleDateString()} />
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
                <ListItemText primary={`${r.username}: ${r.comment}`} secondary={new Date(r.createdAt).toLocaleDateString()} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography>Item not found</Typography>
      )}
    </Box>
  );
};

export default ItemDetail;