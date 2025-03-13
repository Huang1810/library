import React, { useState, useEffect } from 'react';
import API from '../api';
import { Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editPost, setEditPost] = useState(null); // For editing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const userId = localStorage.getItem('userId'); // Assuming user ID stored after login

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
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/forum/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  const handleEditStart = (post) => {
    setEditPost({ id: post._id, title: post.title, content: post.content });
  };

  const handleEditSubmit = async () => {
    if (!editPost.title.trim() || !editPost.content.trim()) {
      setError('Title and Content are required');
      return;
    }
    try {
      const response = await API.put(`/forum/${editPost.id}`, {
        title: editPost.title,
        content: editPost.content,
      });
      setPosts(posts.map(post => (post._id === editPost.id ? response.data : post)));
      setEditPost(null);
      setError(null);
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: '#2e51a2' }}>
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
        <Button variant="contained" onClick={handleSubmit} disabled={posting} fullWidth sx={{ backgroundColor: '#2e51a2' }}>
          {posting ? 'Posting...' : 'Create Post'}
        </Button>
      </Paper>

      {/* Edit Form */}
      {editPost && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            label="Edit Title"
            fullWidth
            value={editPost.title}
            onChange={e => setEditPost({ ...editPost, title: e.target.value })}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Edit Content"
            multiline
            rows={4}
            fullWidth
            value={editPost.content}
            onChange={e => setEditPost({ ...editPost, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleEditSubmit} sx={{ mr: 1, backgroundColor: '#2e51a2' }}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => setEditPost(null)}>Cancel</Button>
        </Paper>
      )}

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
                  {post.user._id === userId && ( // Show controls only for user's posts
                    <Box>
                      <Button onClick={() => handleEditStart(post)} sx={{ color: '#2e51a2', mr: 1 }}>
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(post._id)} sx={{ color: '#d32f2f' }}>
                        Delete
                      </Button>
                    </Box>
                  )}
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