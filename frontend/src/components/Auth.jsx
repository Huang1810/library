import React, { useState } from 'react';
import API from '../api';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/user/login' : '/user/register';
    try {
      const response = await API.post(endpoint, formData);
      localStorage.setItem('token', response.data.token);
      setLoggedIn(true);
      setError('');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>{isLogin ? 'Login' : 'Register'}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />
        )}
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)} sx={{ mt: 1 }}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </Button>
    </Box>
  );
};

export default Auth;