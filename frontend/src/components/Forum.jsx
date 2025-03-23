import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Typography, Box, Button, TextField, List, ListItem, ListItemText, IconButton, Alert, 
  Card, CardContent, CardActions, Divider, Paper 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Forum = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const [editReplyId, setEditReplyId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const loggedIn = !!localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      fetchPosts();
    }
  }, [postId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/forum');
      console.log('API response:', response.data);
      setPosts(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error.response?.data || error.message);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/forum/${postId}`);
      console.log('Post response:', response.data);
      setPost(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching post:', error.response?.data || error.message);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!loggedIn) {
      setError('Please log in to create a post');
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty');
      return;
    }
    try {
      const response = await API.post('/forum', { title, content });
      setPosts([response.data, ...posts]);
      setTitle('');
      setContent('');
      setSuccess('Post created successfully');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      setError('Failed to create post');
    }
  };

  const handleUpdatePost = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    try {
      const response = await API.put(`/forum/${editPostId}`, { title, content });
      setPost(response.data);
      setPosts(posts.map(p => (p._id === editPostId ? response.data : p)));
      setEditPostId(null);
      setTitle('');
      setContent('');
      setSuccess('Post updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (error) {
      console.error('Error updating post:', error.response?.data || error.message);
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (id) => {
    if (!loggedIn) {
      setError('Please log in to delete');
      return;
    }
    try {
      await API.delete(`/forum/${id}`);
      if (postId) {
        setPost(null);
        navigate('/forum');
        await fetchPosts();
      } else {
        await fetchPosts();
      }
      setSuccess('Post deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
      setError('Failed to delete post');
    }
  };

  const handleAddReply = async () => {
    if (!loggedIn) {
      setError('Please log in to reply');
      return;
    }
    if (!replyContent.trim()) {
      setError('Reply content cannot be empty');
      return;
    }
    try {
      await API.post(`/forum/${postId}/reply`, { content: replyContent });
      setReplyContent('');
      setSuccess('Reply added successfully');
      setTimeout(() => setSuccess(null), 3000);
      await fetchPost();
      setError(null);
    } catch (error) {
      console.error('Error adding reply:', error.response?.data || error.message);
      setError('Failed to add reply');
    }
  };

  const handleUpdateReply = async () => {
    if (!editContent.trim()) {
      setError('Reply content cannot be empty');
      return;
    }
    try {
      const response = await API.put(`/forum/${postId}/reply`, { replyId: editReplyId, content: editContent });
      setPost(response.data);
      setEditReplyId(null);
      setEditContent('');
      setSuccess('Reply updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (error) {
      console.error('Error updating reply:', error.response?.data || error.message);
      setError('Failed to update reply');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!loggedIn) {
      setError('Please log in to delete');
      return;
    }
    try {
      const response = await API.delete(`/forum/${postId}/reply/${replyId}`);
      setPost(response.data);
      setSuccess('Reply deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting reply:', error.response?.data || error.message);
      setError('Failed to delete reply');
    }
  };

  if (loading) return <Typography variant="h6" align="center">Loading...</Typography>;
  if (error) return <Typography variant="h6" align="center">{error}</Typography>;
  if (!postId && (!posts || posts.length === 0)) return <Typography variant="h6" align="center">No posts yet</Typography>;
  if (postId && !post) return <Typography variant="h6" align="center">Post not found</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Forum
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!postId ? (
        <>
          {loggedIn && (
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Create a New Post</Typography>
              <TextField
                label="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Post Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={editPostId ? handleUpdatePost : handleCreatePost}
                sx={{ 
                  borderRadius: 1, 
                  textTransform: 'none', 
                  px: 3, 
                  py: 1, 
                  '&:hover': { bgcolor: '#115293' } 
                }}
              >
                {editPostId ? 'Update Post' : 'Create Post'}
              </Button>
            </Paper>
          )}
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map(p => (
              <Card
                key={p._id}
                elevation={2}
                sx={{ 
                  borderRadius: 2, 
                  '&:hover': { boxShadow: 6 }, 
                  transition: 'box-shadow 0.3s' 
                }}
              >
                <CardContent>
                  <ListItem
                    secondaryAction={
                      loggedIn && p.user?._id === userId && (
                        <Box>
                          <IconButton 
                            onClick={() => { setEditPostId(p._id); setTitle(p.title); setContent(p.content); }} 
                            sx={{ color: '#1976d2' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeletePost(p._id)} 
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                  >
                    <ListItemText
                      primary={
                        <Link to={`/forum/${p._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            {p.title}
                          </Typography>
                        </Link>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          By {p.user?.username || 'Deleted User'} - {new Date(p.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                </CardContent>
              </Card>
            ))}
          </List>
        </>
      ) : post ? (
        <Box>
          <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {post.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                By {post.user?.username || 'Deleted User'} - {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.6 }}>
                {post.content}
              </Typography>
            </CardContent>
            {loggedIn && post.user?._id === userId && (
              <CardActions sx={{ p: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => { setEditPostId(post._id); setTitle(post.title); setContent(post.content); }}
                  sx={{ borderRadius: 1, textTransform: 'none', mr: 1 }}
                >
                  Edit Post
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeletePost(post._id)}
                  sx={{ borderRadius: 1, textTransform: 'none' }}
                >
                  Delete Post
                </Button>
              </CardActions>
            )}
          </Card>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              Replies
            </Typography>
            {loggedIn && (
              <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <TextField
                  label="Add a Reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddReply}
                  sx={{ borderRadius: 1, textTransform: 'none', px: 3, py: 1, '&:hover': { bgcolor: '#115293' } }}
                >
                  Submit Reply
                </Button>
              </Paper>
            )}
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {post.replies.map(r => (
                <Card key={r._id} elevation={1} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <ListItem
                      secondaryAction={
                        loggedIn && r.user?._id === userId && (
                          <>
                            {editReplyId === r._id ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  multiline
                                  rows={2}
                                  sx={{ width: 300 }}
                                />
                                <Button 
                                  variant="contained" 
                                  size="small" 
                                  onClick={handleUpdateReply}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Save
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  onClick={() => setEditReplyId(null)}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            ) : (
                              <Box>
                                <IconButton 
                                  onClick={() => { setEditReplyId(r._id); setEditContent(r.content); }} 
                                  sx={{ color: '#1976d2' }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  onClick={() => handleDeleteReply(r._id)} 
                                  sx={{ color: '#d32f2f' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            )}
                          </>
                        )
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>{r.user?.username || 'Deleted User'}</strong>: {r.content}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" align="center">Post not found</Typography>
      )}
    </Box>
  );
};

export default Forum;