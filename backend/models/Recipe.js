// models/Recipe.js
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: String,
  spoonacularId: Number,
  calories: Number, // field for calories
  dietaryPreferences: [String], // field for dietary preferences
  cuisine: String, // field for cuisine type
  cookingTime: Number, // field for cooking time
});

module.exports = mongoose.model('Recipe', RecipeSchema);
