// routes/recipes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Recipe = require("../models/Recipe");

// Fetch recipes from Spoonacular API and save to MongoDB
router.get("/fetch", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const recipes = response.data.recipes;

    // Save recipes to MongoDB
    const savedRecipes = await Promise.all(
      recipes.map(async (recipeData) => {
        const existingRecipe = await Recipe.findOne({
          spoonacularId: recipeData.id,
        });
        if (existingRecipe) return existingRecipe;

        const recipe = new Recipe({
          title: recipeData.title,
          ingredients: recipeData.extendedIngredients.map(
            (ing) => ing.original
          ),
          instructions: recipeData.instructions,
          spoonacularId: recipeData.id,
          // calories: recipeData.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount,
          dietaryPreferences: recipeData.diets,
          cuisine: recipeData.cuisines[0],
          cookingTime: recipeData.readyInMinutes,
          sourceUrl: recipeData.sourceUrl,
        });

        return await recipe.save();
      })
    );

    res.json(savedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Get all recipes from MongoDB
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/search", async (req, res) => {
  const { ingredients } = req.query;

  try {
    let recipes = await Recipe.find();

    // Log the initial recipes fetched from the database
    console.log("Initial recipes:", recipes);

    if (ingredients) {
      const ingredientsArray = ingredients.split(",");
      console.log("Filtering by ingredients:", ingredientsArray);

      recipes = recipes.filter((recipe) =>
        ingredientsArray.every((ing) =>
          recipe.ingredients.some((recipeIng) =>
            recipeIng.toLowerCase().includes(ing.toLowerCase().trim())
          )
        )
      );
    }

    // Log the filtered recipes
    console.log("Filtered recipes:", recipes);
    res.json(recipes);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

// Get a specific recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Search for recipes with various filters
// router.get("/search", async (req, res) => {
//   const {
//     ingredients,
//     excludeIngredients,
//     maxCalories,
//     dietaryPreferences,
//     cuisine,
//     maxCookingTime,
//   } = req.query;
//   try {
//     let recipes = await Recipe.find();

//     if (ingredients) {
//       const ingredientsArray = ingredients.split(",");
//       recipes = recipes.filter((recipe) =>
//         ingredientsArray.every((ing) => recipe.ingredients.includes(ing))
//       );
//     }

//     if (excludeIngredients) {
//       const excludeArray = excludeIngredients.split(",");
//       recipes = recipes.filter(
//         (recipe) =>
//           !excludeArray.some((ing) => recipe.ingredients.includes(ing))
//       );
//     }

//     if (maxCalories) {
//       recipes = recipes.filter((recipe) => recipe.calories <= maxCalories);
//     }

//     if (dietaryPreferences) {
//       const preferencesArray = dietaryPreferences.split(",");
//       recipes = recipes.filter((recipe) =>
//         preferencesArray.every((pref) =>
//           recipe.dietaryPreferences.includes(pref)
//         )
//       );
//     }

//     if (cuisine) {
//       recipes = recipes.filter((recipe) => recipe.cuisine === cuisine);
//     }

//     if (maxCookingTime) {
//       recipes = recipes.filter(
//         (recipe) => recipe.cookingTime <= maxCookingTime
//       );
//     }

//     res.json(recipes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// router.get("/search", async (req, res) => {
//   const ingredients = req.query.ingredients;

//   if (!ingredients) {
//     return res
//       .status(400)
//       .json({ error: "Ingredients query parameter must be provided." });
//   }

//   const ingredientsArray = ingredients.split(",");

//   try {
//     const recipes = await Recipe.find({
//       ingredients: { $all: ingredientsArray },
//     });

//     res.json(recipes);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
