import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const quotes = [
  "Cooking is love made visible.",
  "The secret ingredient is always love.",
  "Good food, good mood.",
  "In the kitchen, we create.",
  "Happiness is homemade.",
  "Food is the ingredient that binds us together.",
  "Cooking is an art, baking is a science.",
  "Where there is food, there is love.",
  "The best memories are made around the table.",
  "Life is short, lick the spoon."
];

/**
 * Home Component - Renders a list of recipes fetched from the server. Allows users to save recipes and delete their own recipes.
 */
export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState("");
  const userID = useGetUserID();

  useEffect(() => {
    // Initialize the quote
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Update the quote every 5 minutes
    const quoteInterval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Clear interval on component unmount
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://server-578r.onrender.com/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://server-578r.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      }
    };

    const fetchAllData = async () => {
      await fetchRecipes();
      await fetchSavedRecipes();
      setLoading(false);
    };

    fetchAllData();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    if (!userID) {
      alert("You need to log in first to save a recipe.");
      return;
    }

    try {
      const response = await axios.put("https://server-578r.onrender.com/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  const deleteRecipe = async (recipeID) => {
    if (!userID) {
      alert("You need to log in first to delete a recipe.");
      return;
    }

    try {
      const response = await axios.delete(`https://server-578r.onrender.com/recipes/${recipeID}/${userID}`);
      if (response.status === 200) {
        alert("Recipe deleted successfully");
        setRecipes(recipes.filter(recipe => recipe._id !== recipeID));
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Recipe Catalog App</h1>
        <div className="quote">{currentQuote}</div>
      </header>
      <main>
        <h1>Recipes</h1>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ul className="recipe-list">
            {recipes.map((recipe) => (
              <li key={recipe._id} className="recipe-card">
                <div className="recipe-header">
                  <h2>{recipe.name}</h2>
                  <h3>by {recipe.creator}</h3>
                </div>
                <p className="text-ingredients">Ingredients: {recipe.ingredients.join(", ")}</p>
                <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
                <div className="recipe-footer">
                  <p>Cooking Time: {recipe.cookingTime} minutes</p>
                  <div className="recipe-actions">
                    <button
                      className="save-btn"
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={isRecipeSaved(recipe._id)}
                    >
                      {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                    </button>
                    {userID === recipe.userOwner && (
                      <button className="delete-btn" onClick={() => deleteRecipe(recipe._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="instructions">
                  <p className="text-instruction">{recipe.instructions}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
