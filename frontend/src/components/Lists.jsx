import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Card, 
  CardContent, 
  IconButton, 
  Alert, 
  Divider 
} from '@mui/material';
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
      await API.delete('/user/list', { data: { itemId } });
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

  if (!loggedIn) return (
    <Typography 
      variant="h6" 
      sx={{ textAlign: 'center', color: '#757575', py: 4 }}
    >
      Please log in to view your lists.
    </Typography>
  );
  if (loading) return (
    <Typography 
      variant="h6" 
      sx={{ textAlign: 'center', color: '#757575', py: 4 }}
    >
      Loading Your Lists...
    </Typography>
  );
  if (error) return (
    <Typography 
      variant="h6" 
      sx={{ textAlign: 'center', color: '#d32f2f', py: 4 }}
    >
      {error}
    </Typography>
  );

  const Section = ({ title, items, category }) => (
    <Box sx={{ my: 4 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          fontWeight: 'bold', 
          color: '#ffffff', 
          background: 'linear-gradient(90deg,rgb(80, 28, 169),rgb(37, 13, 146))', 
          p: 1, 
          borderRadius: 1, 
          display: 'inline-block' 
        }}
      >
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography sx={{ color: '#616161' }}>Nothing added yet.</Typography>
      ) : (
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            overflowX: 'auto', 
            pb: 2, 
            '&::-webkit-scrollbar': { height: '8px' }, 
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#757575', borderRadius: '4px' } 
          }}
        >
          {items.map(item => (
            <Card 
              key={item.item._id} 
              sx={{ 
                minWidth: 250, 
                maxWidth: 250, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                transition: 'transform 0.3s', 
                '&:hover': { transform: 'scale(1.05)' } 
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography 
                    variant="subtitle1" 
                    component={Link} 
                    to={`/${category}/${item.item.externalId}`} 
                    sx={{ 
                      color: '#ff6f61', 
                      textDecoration: 'none', 
                      fontWeight: 'medium', 
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {item.item.title}
                  </Typography>
                  {loggedIn && (
                    <IconButton 
                      onClick={() => handleRemove(item.item._id)} 
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #1a237e, #3f51b5)', 
          color: '#fff' 
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Your Personal Lists
        </Typography>
      </Paper>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Section title="Favorite Games" items={games} category="games" />
      <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />
      <Section title="Favorite Novels" items={books} category="books" />
      <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />
      <Section title="Favorite Anime" items={anime} category="anime" />
    </Box>
  );
};

export default Lists;