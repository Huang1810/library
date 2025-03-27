import React, { useState, useEffect } from 'react';
import API from '../api';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Divider, 
  Avatar, 
  Stack, 
  Rating, 
  Chip, 
  Alert 
} from '@mui/material';

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
                        category.charAt(0).toUpperCase() + category.slice(1, -1);
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
                  category.charAt(0).toUpperCase() + category.slice(1, -1);
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

  if (loading) return (
    <Typography variant="h6" sx={{ textAlign: 'center', color: '#757575', py: 4 }}>
      Loading Details...
    </Typography>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4 }}>
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {item ? (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, background: '#fafafa' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ flexShrink: 0 }}>
              <img
                src={item.coverImage || 'https://via.placeholder.com/200x300'}
                alt={item.title}
                style={{ width: 200, height: 300, borderRadius: '12px', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ color: '#ff6f61', fontWeight: 'bold', mb: 2 }}
              >
                {item.title}
              </Typography>
              <Stack spacing={1}>
                {category === 'games' && (
                  <>
                    <Typography variant="body1"><strong>Developer:</strong> {item.developer || 'Unknown'}</Typography>
                    <Typography variant="body1"><strong>Release:</strong> {item.releaseDate || 'N/A'}</Typography>
                    <Typography variant="body1"><strong>Platforms:</strong> {item.platforms?.join(', ') || 'N/A'}</Typography>
                  </>
                )}
                {category === 'books' && (
                  <>
                    <Typography variant="body1"><strong>Author(s):</strong> {item.authors?.join(', ') || 'Unknown'}</Typography>
                    <Typography variant="body1"><strong>Published:</strong> {item.publishedDate || 'N/A'}</Typography>
                    <Typography variant="body1"><strong>ISBN:</strong> {item.isbn || 'N/A'}</Typography>
                  </>
                )}
                {category === 'anime' && (
                  <>
                    <Typography variant="body1"><strong>Studio:</strong> {item.studio || 'Unknown'}</Typography>
                    <Typography variant="body1"><strong>Episodes:</strong> {item.episodes || 'N/A'}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {item.airingStatus || 'N/A'}</Typography>
                  </>
                )}
                <Typography variant="body1">
                  <strong>Genre:</strong> {Array.isArray(item.genre) ? item.genre.map(g => <Chip label={g} sx={{ m: 0.5 }} />) : item.genre || 'N/A'}
                </Typography>
              </Stack>
              {loggedIn && (
                <Box sx={{ mt: 2 }}>
                  {isInList ? (
                    <Chip label="In Your List" color="success" variant="outlined" />
                  ) : (
                    <Button 
                      variant="contained" 
                      sx={{ backgroundColor: '#ff9f1c', '&:hover': { backgroundColor: '#f57c00' } }} 
                      onClick={handleAddToList}
                    >
                      Add to List
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Stack>

          <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

          <Typography 
            variant="h5" 
            sx={{ color: '#424242', mb: 2, fontWeight: 'medium' }}
          >
            Description
          </Typography>
          <Typography sx={{ color: '#616161', lineHeight: 1.6 }}>
            {item.description || 'No description available'}
          </Typography>

          <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: '#424242', mb: 2 }}>Rate This {category.slice(0, -1)}</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Rating
                value={rating ? parseInt(rating) : 0}
                onChange={(e, newValue) => setRating(newValue)}
                precision={1}
                max={5}
              />
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#e64a19' } }} 
                onClick={handleRating}
              >
                Submit Rating
              </Button>
            </Stack>
            <Typography variant="subtitle2" sx={{ mt: 1, color: '#757575' }}>
              Average Rating: {item.averageRating || 'Not yet rated'}
            </Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {item.ratings.map(r => (
                <Box key={r._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>{r.username?.[0]}</Avatar>
                  <Typography variant="body2">{r.username}: {r.rating} - {new Date(r.createdAt).toLocaleDateString()}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

          <Box>
            <Typography variant="h5" sx={{ color: '#424242', mb: 2 }}>Comments</Typography>
            <TextField
              label="Your Comment"
              multiline
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#ff9f1c', '&:hover': { backgroundColor: '#f57c00' } }} 
              onClick={handleComment}
            >
              Post Comment
            </Button>
            <Stack spacing={2} sx={{ mt: 3 }}>
              {item.reviews.map(r => (
                <Paper key={r._id} sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#ff6f61' }}>{r.username?.[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{r.username}</Typography>
                      <Typography variant="body2" color="text.secondary">{r.comment}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#757575' }}>
          Item not found
        </Typography>
      )}
    </Box>
  );
};

export default ItemDetail;