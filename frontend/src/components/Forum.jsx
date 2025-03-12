import React, { useState, useEffect } from 'react';
import API from '../api';
import { Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    API.get('/forum')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and Content are required');
      return;
    }

    setPosting(true);
    try {
      const response = await API.post('/forum', newPost);
      setPosts([response.data, ...posts]); // Add new post at the top
      setNewPost({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Forum
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Post Creation */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Title"
          fullWidth
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          sx={{ mb: 1 }}
        />
        <TextField
          label="Content"
          multiline
          rows={4}
          fullWidth
          value={newPost.content}
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={posting} fullWidth>
          {posting ? 'Posting...' : 'Create Post'}
        </Button>
      </Paper>

      {/* Forum Posts */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {posts.length > 0 ? (
            posts.map(post => (
              <Paper sx={{ p: 2, mb: 2 }} key={post._id}>
                <ListItem>
                  <ListItemText
                    primary={post.title}
                    secondary={`${post.user.username}: ${post.content}`}
                  />
                </ListItem>
              </Paper>
            ))
          ) : (
            <Typography>No posts available. Be the first to post!</Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default Forum;
