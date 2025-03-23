const List = require('../models/List');

exports.createList = async (req, res) => {
  const { name } = req.body;
  try {
    const list = new List({
      userId: req.user.id,
      name,
      items: []
    });
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserLists = async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user.id });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToList = async (req, res) => {
  const { listId, category, itemId } = req.body;
  try {
    const list = await List.findOne({ _id: listId, userId: req.user.id });
    if (!list) return res.status(404).json({ msg: 'List not found or unauthorized' });

    // Prevent duplicates
    if (!list.items.some(item => item.category === category && item.itemId === itemId)) {
      list.items.push({ category, itemId });
      await list.save();
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromList = async (req, res) => {
  const { listId, itemId } = req.params;
  try {
    const list = await List.findOne({ _id: listId, userId: req.user.id });
    if (!list) return res.status(404).json({ msg: 'List not found or unauthorized' });

    list.items = list.items.filter(item => item.itemId !== itemId);
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteList = async (req, res) => {
  const { listId } = req.params;
  try {
    const list = await List.findOneAndDelete({ _id: listId, userId: req.user.id });
    if (!list) return res.status(404).json({ msg: 'List not found or unauthorized' });
    res.json({ msg: 'List deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};