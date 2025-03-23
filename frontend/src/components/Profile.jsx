import React, { useState, useEffect } from 'react';
import API from '../api';
import { Typography, List, ListItem, ListItemText, Avatar, Box, Button, IconButton, TextField, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/user/profile');
      setUser(response.data);
      setNewUsername(response.data.username);
      setError(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Login required or server error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }
    try {
      const response = await API.put('/user/profile', { username: newUsername });
      setUser(prevUser => ({ ...prevUser, username: response.data.username }));
      setIsEditingUsername(false);
      setSuccess('Username updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (error) {
      console.error('Error updating username:', error.response?.data || error.message);
      setError(error.response?.data?.msg || 'Failed to update username');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await API.delete('/user/list', { data: { itemId } });
      setUser(prevUser => ({
        ...prevUser,
        list: prevUser.list.filter(item => item.item._id !== itemId),
      }));
      setSuccess('Item removed from your list');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error removing item:', error.response?.data || error.message);
      setError('Failed to remove item');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!user) return <Typography>Please log in</Typography>;

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Avatar src={user.profileImage} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
        {isEditingUsername ? (
          <>
            <TextField
              label="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              sx={{ mr: 2, width: 200 }}
            />
            <Button variant="contained" onClick={handleUpdateUsername} sx={{ mr: 1 }}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setIsEditingUsername(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">Username: {user.username}</Typography>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => setIsEditingUsername(true)}
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </Box>
      <Typography>Email: {user.email}</Typography>
      <Typography>Bio: {user.bio || 'No bio'}</Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>My List</Typography>
      {user.list.length === 0 ? (
        <Typography>No items in your list yet.</Typography>
      ) : (
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
      )}
    </Box>
  );
};

export default Profile;