const ForumPost = require('../models/ForumPost');

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new ForumPost({ user: req.user.id, title, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('user', 'username').populate('replies.user', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId)
      .populate('user', 'username')
      .populate('replies.user', 'username');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.postId, user: req.user.id },
      { title, content },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: 'Post not found or unauthorized' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findOneAndDelete({ _id: req.params.postId, user: req.user.id });
    if (!post) return res.status(404).json({ msg: 'Post not found or unauthorized' });
    res.json({ msg: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReply = async (req, res) => {
  const { content } = req.body;
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    post.replies.push({ user: req.user.id, content });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReply = async (req, res) => {
  const { replyId, content } = req.body;
  try {
    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.postId, 'replies._id': replyId, 'replies.user': req.user.id },
      { $set: { 'replies.$.content': content } },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: 'Reply not found or unauthorized' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReply = async (req, res) => {
  const { replyId } = req.params;
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    post.replies = post.replies.filter(reply => reply._id.toString() !== replyId || reply.user.toString() !== req.user.id);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};