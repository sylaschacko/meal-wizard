// routes/pantry.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add ingredient to pantry
router.post('/add', async (req, res) => {
  const { userId, ingredient } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
    user.pantry.push(ingredient);
    await user.save();
    res.json(user.pantry);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Remove ingredient from pantry
router.post('/remove', async (req, res) => {
  const { userId, ingredient } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
    user.pantry = user.pantry.filter(ing => ing !== ingredient);
    await user.save();
    res.json(user.pantry);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
