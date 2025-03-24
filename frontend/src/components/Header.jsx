import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1c1c1c', padding: '0.5rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>
          MyLibraryList
        </Typography>

        
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