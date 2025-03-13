import React, { useState, useEffect } from 'react';
import API from '../api';
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';

const ForumPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/forum/${id}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return <Typography>No post found</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ color: '#2e51a2', mb: 2 }}>
        {post.title}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.content}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#666' }}>
          Posted by {post.user.username} on {new Date(post.createdAt).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForumPostDetail;