import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [cuisine, setCuisine] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");

  const addIngredient = () => {
    if (input) {
      const newIngredients = input
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item && !ingredients.includes(item));
      setIngredients([...ingredients, ...newIngredients]);
      setInput("");
    }
  };

  const removeIngredient = (removedIngredient) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== removedIngredient)
    );
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await axios.get("localhost:5000/api/recipes/fetch");
        setRecipes(response.data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (ingredients.length > 0) {
      searchRecipes();
    } else {
      setRecipes([]);
    }
  }, [ingredients]);

  const searchRecipes = async () => {
    try {
      const query = new URLSearchParams();
      if (ingredients.length > 0) {
        query.append("ingredients", ingredients.join(","));
      }
      const response = await axios.get(
        `localhost:5000/api/recipes/search?${query.toString()}`
      );
      setRecipes(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const fetchRecipes = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://api.spoonacular.com/recipes/findByIngredients",
  //       {
  //         params: {
  //           ingredients: ingredients.join(","),
  //           number: 5,
  //           apiKey: "256a732328dd4011a0b093bc7ea667b3",
  //         },
  //       }
  //     );

  //     const recipeIds = response.data.map((recipe) => recipe.id);
  //     const recipeUrlsPromises = recipeIds.map((id) =>
  //       axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
  //         params: {
  //           apiKey: "256a732328dd4011a0b093bc7ea667b3",
  //         },
  //       })
  //     );

  //     const recipeUrlsResponses = await Promise.all(recipeUrlsPromises);
  //     const recipeUrls = recipeUrlsResponses.map((res) => res.data);

  //     const combinedInfo = response.data.map((recipe) => {
  //       const recipeUrl = recipeUrls.find((res) => res.id === recipe.id);
  //       return {
  //         ...recipe,
  //         sourceUrl: recipeUrl.sourceUrl,
  //       };
  //     });
  //     console.log(combinedInfo);
  //     setRecipes(combinedInfo);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const specifyCuisine = (e) => {
  //   setCuisine(cuisineInput);
  //   setInput("");
  // };

  // useEffect(() => {
  //   if (ingredients.length > 0) {
  //     fetchRecipes();
  //   }
  // }, [ingredients, fetchRecipes]);

  return (
    <body>
      <div className="App">
        <h1 className="appName">Meal Wizard</h1>
        <div className="center-container">
          <input
            type="text"
            placeholder="Input ingredient(s)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                addIngredient();
              }
            }}
          />
        </div>
        <div className="ingredients">
          <h2 className="title">Ingredients:</h2>
          <div className="ingredients-list">
            {ingredients.map((ingredient, index) => {
              return (
                <div key={index} className="ingredient-item">
                  {ingredient}
                  <div
                    onClick={() => removeIngredient(ingredient)}
                    className="delete-button"
                  >
                    ❌
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="recipes">
          <h2 className="title">Recipes:</h2>
          <div>
            <input
              placeholder="Specify a cuisine or leave blank"
              value={cuisineInput}
              onChange={(e) => setCuisineInput(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  specifyCuisine();
                }
              }}
            />
          </div>

          <div>
            <div className="recipes-list">
              {recipes.map((recipe) => (
                <div key={recipe.spoonacularId} className="recipe-item">
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h2 className="recipe">{recipe.title}</h2>
                  </a>
                  <p>{recipe.missedIngredientCount} missing</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default App;
