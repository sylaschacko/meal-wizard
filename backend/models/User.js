// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pantry: [String], // Field for pantry ingredients
  shoppingList: [String], // Field for shopping list
});

module.exports = mongoose.model('User', UserSchema);
