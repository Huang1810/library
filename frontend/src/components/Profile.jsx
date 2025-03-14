import React, { useState, useEffect } from 'react';
import API from '../api';
import { Typography, List, ListItem, ListItemText, Avatar, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/user/profile');
      setUser(response.data);
      setError(null);
    } catch (error) {
      setError('Login required or server error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await API.delete('/user/list', { data: { itemId } }); // Send itemId to remove
      setUser(prevUser => ({
        ...prevUser,
        list: prevUser.list.filter(item => item.item._id !== itemId),
      }));
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!user) return <Typography>Please log in</Typography>;

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Avatar src={user.profileImage} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
      <Typography variant="h6">Username: {user.username}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Bio: {user.bio || 'No bio'}</Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>My List</Typography>
      <List>
        {user.list.map(item => (
          <ListItem
            key={item.item._id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.item._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Link to={`/${item.itemModel.toLowerCase() + 's'}/${item.item.externalId}`} style={{ textDecoration: 'none', color: '#2e51a2' }}>
                  {`${item.item.title} (${item.itemModel})`}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Profile;