import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${search}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1c1c1c', padding: '0.5rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>
          MyLibraryList
        </Typography>

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: '40%' }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search anime, books, or games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: '4px', width: '100%' }}
          />
          <IconButton type="submit" sx={{ color: 'white', ml: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Navigation */}
        <Box>
          {loggedIn ? (
            <>
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/forum">
                <ForumIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/auth">Login / Register</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
