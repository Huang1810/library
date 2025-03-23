import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './components/Home'; 
import Library from './components/Library';
import Profile from './components/Profile';
import Auth from './components/Auth';
import ItemDetail from './components/ItemDetail';
import Forum from './components/Forum';
import Lists from './components/Lists';
import { Box, Container } from '@mui/material';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Container sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            {/* Removed: <Route path="/top5" element={<Top5 />} /> */}
            <Route path="/auth" element={<Auth setLoggedIn={setLoggedIn} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/:category/:externalId" element={<ItemDetail />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:postId" element={<Forum />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;