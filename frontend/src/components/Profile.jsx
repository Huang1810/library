import React, { useState, useEffect } from 'react';
import API from '../api';
import { Typography, List, ListItem, ListItemText, Avatar, Box } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/user/profile')
      .then(response => setUser(response.data))
      .catch(error => console.error('Login required', error));
  }, []);

  if (!user) return <Typography>Please log in</Typography>;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Avatar src={user.profileImage} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
      <Typography variant="h6">Username: {user.username}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Bio: {user.bio || 'No bio'}</Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>My List</Typography>
      <List>
        {user.list.map(item => (
          <ListItem key={item.item._id}>
            <ListItemText primary={`${item.item.title} (${item.itemModel})`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Profile;