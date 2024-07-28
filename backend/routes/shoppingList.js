// routes/shoppingList.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Generate shopping list based on selected recipes
router.post('/generate', async (req, res) => {
  const { userId, recipeIds } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });
    const allIngredients = recipes.flatMap(recipe => recipe.ingredients);
    const missingIngredients = allIngredients.filter(ing => !user.pantry.includes(ing));
    user.shoppingList = missingIngredients;
    await user.save();
    res.json(user.shoppingList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
