import React, { useState, useEffect } from 'react';
import API from '../api';
import { Typography, Box, List, ListItem, ListItemText, Divider, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Lists = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const loggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (loggedIn) {
      fetchUserList();
    } else {
      setLoading(false);
    }
  }, [loggedIn]);

  const fetchUserList = async () => {
    try {
      setLoading(true);
      const response = await API.get('/user/profile');
      setUserList(response.data.list || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching user list:', err);
      setError('Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!loggedIn) {
      setError('Please log in to remove items');
      return;
    }
    try {
      await API.delete('/user/list', { data: { itemId } }); // Matches userController.removeFromList
      setUserList(prevList => prevList.filter(item => item.item._id !== itemId));
      setSuccess('Item removed from your list');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error removing item:', error.response?.data || error.message);
      setError('Failed to remove item');
    }
  };

  const games = userList.filter(item => item.itemModel === 'Game');
  const books = userList.filter(item => item.itemModel === 'Book');
  const anime = userList.filter(item => item.itemModel === 'Anime');

  if (!loggedIn) return <Typography>Please log in to view your lists.</Typography>;
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Lists</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h5">Games</Typography>
      {games.length === 0 ? (
        <Typography>No games added yet.</Typography>
      ) : (
        <List>
          {games.map(item => (
            <ListItem
              key={item.item._id}
              secondaryAction={
                loggedIn && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.item._id)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Link to={`/games/${item.item.externalId}`} style={{ textDecoration: 'none', color: '#2e51a2' }}>
                    {item.item.title}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 2 }} />

      <Typography variant="h5">Books</Typography>
      {books.length === 0 ? (
        <Typography>No books added yet.</Typography>
      ) : (
        <List>
          {books.map(item => (
            <ListItem
              key={item.item._id}
              secondaryAction={
                loggedIn && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.item._id)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Link to={`/books/${item.item.externalId}`} style={{ textDecoration: 'none', color: '#2e51a2' }}>
                    {item.item.title}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 2 }} />

      <Typography variant="h5">Anime</Typography>
      {anime.length === 0 ? (
        <Typography>No anime added yet.</Typography>
      ) : (
        <List>
          {anime.map(item => (
            <ListItem
              key={item.item._id}
              secondaryAction={
                loggedIn && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.item._id)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={
                  <Link to={`/anime/${item.item.externalId}`} style={{ textDecoration: 'none', color: '#2e51a2' }}>
                    {item.item.title}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Lists;