import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Home, LibraryBooks, Star, Forum, List as ListIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Library', icon: <LibraryBooks />, path: '/library' },
    { text: 'Lists', icon: <ListIcon />, path: '/lists' },
    { text: 'Forum', icon: <Forum />, path: '/forum' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #ddd',
        },
      }}
    >
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            component={Link}
            to={path}
            selected={location.pathname === path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#2e51a2',
                color: 'white',
                '& .MuiListItemIcon-root': { color: 'white' },
              },
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;