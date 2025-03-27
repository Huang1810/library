import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Card, 
  CardContent, 
  Avatar, 
  IconButton, 
  TextField, 
  Button, 
  Alert, 
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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

  if (loading) return (
    <Typography variant="h6" sx={{ textAlign: 'center', color: '#757575', py: 4 }}>
      Loading Profile...
    </Typography>
  );
  if (error) return (
    <Typography variant="h6" sx={{ textAlign: 'center', color: '#EF5350', py: 4 }}>
      {error}
    </Typography>
  );
  if (!user) return (
    <Typography variant="h6" sx={{ textAlign: 'center', color: '#757575', py: 4 }}>
      Please log in
    </Typography>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 5 }}>
      {/* Profile Header */}
      <Paper 
        elevation={6}
        sx={{ 
          p: { xs: 2, md: 4 }, 
          mb: 5, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #6A1B9A, #AB47BC)', 
          color: '#fff', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Avatar 
            src={user.profileImage} 
            sx={{ 
              width: { xs: 100, md: 140 }, 
              height: { xs: 100, md: 140 }, 
              border: '4px solid #FFB300',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }} 
          />
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#FFB300' }}>
              {user.username}
            </Typography>
            {isEditingUsername ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <TextField
                  label="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  variant="filled"
                  size="small"
                  sx={{ bgcolor: '#fff', borderRadius: 1, width: 220 }}
                />
                <Tooltip title="Save">
                  <IconButton 
                    onClick={handleUpdateUsername} 
                    sx={{ color: '#26A69A', bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: '#26A69A', color: '#fff' } }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton 
                    onClick={() => setIsEditingUsername(false)} 
                    sx={{ color: '#EF5350', bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: '#EF5350', color: '#fff' } }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Tooltip title="Edit Username">
                <IconButton 
                  onClick={() => setIsEditingUsername(true)} 
                  sx={{ color: '#26A69A', ml: 2 }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Typography variant="subtitle1" sx={{ mt: 2, opacity: 0.9 }}>
              {user.email}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.85)' }}>
              {user.bio || 'No bio yet'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Alerts */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {success && <Alert severity="success" sx={{ bgcolor: '#E0F2F1' }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ bgcolor: '#FFEBEE' }}>{error}</Alert>}
      </Stack>

      {/* Favorites Section */}
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold', 
            color: '#fff', 
            background: 'linear-gradient(90deg, #26A69A, #FFB300)', 
            p: 1.5, 
            borderRadius: 2, 
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          My Favorites
        </Typography>
        {user.list.length === 0 ? (
          <Typography sx={{ color: '#616161', py: 2, fontStyle: 'italic' }}>
            Your list is empty—start adding your favorites!
          </Typography>
        ) : (
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              overflowX: 'auto', 
              pb: 2, 
              '&::-webkit-scrollbar': { height: '10px' }, 
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#FFB300', borderRadius: '5px' }
            }}
          >
            {user.list.map(item => (
              <Card 
                key={item.item._id} 
                sx={{ 
                  minWidth: 280, 
                  maxWidth: 280, 
                  borderRadius: 3, 
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)', 
                  transition: 'all 0.3s ease-in-out', 
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' } 
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        component={Link} 
                        to={`/${item.itemModel.toLowerCase() + 's'}/${item.item.externalId}`} 
                        sx={{ 
                          color: '#26A69A', 
                          textDecoration: 'none', 
                          fontWeight: 'bold', 
                          '&:hover': { color: '#00796B', textDecoration: 'underline' }
                        }}
                      >
                        {item.item.title}
                      </Typography>
                      <Chip 
                        label={item.itemModel} 
                        size="small" 
                        sx={{ mt: 1, backgroundColor: '#FFB300', color: '#fff', fontWeight: 'medium' }} 
                      />
                    </Box>
                    <Tooltip title="Remove from Favorites">
                      <IconButton 
                        onClick={() => handleRemove(item.item._id)} 
                        sx={{ color: '#EF5350', '&:hover': { color: '#D32F2F' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
      <Divider sx={{ my: 4, borderColor: '#E0E0E0' }} />
    </Box>
  );
};

export default Profile;