import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

/**
 * SavedRecipes Component - Renders a list of recipes saved by the user.
 */
export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const userID = useGetUserID();

  useEffect(() => {
    if (userID) {
      /**
       * Fetches saved recipes for the user from the server.
       */
      const fetchSavedRecipes = async () => {
        try {
          const response = await axios.get(
            `https://server-578r.onrender.com/recipes/savedRecipes/${userID}`
          );
          setSavedRecipes(response.data.savedRecipes);
        } catch (err) {
          console.error("Error fetching saved recipes:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSavedRecipes();
    } else {
      setLoading(false);
    }
  }, [userID]);

  /**
   * Unsave a recipe from the user's saved list.
   * @param {string} recipeID - The ID of the recipe to be unsaved.
   */
  const unsaveRecipe = async (recipeID) => {
    try {
      await axios.delete(`https://server-578r.onrender.com/recipes/savedRecipes/${recipeID}/${userID}`);
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeID));
      alert("Recipe unsaved successfully");
    } catch (err) {
      console.error("Error unsaving recipe:", err);
      alert("Error unsaving recipe:", err);
    }
  };

  if (!userID) {
    return <div className="login-text"><b>You need to log in to view your saved recipes.</b></div>;
  }

  if (loading) {
    return <div className="loading"><b>Loading...</b></div>;
  }

  return (
    <div>
      <h1>Saved Recipes</h1>
      {savedRecipes.length === 0 ? (
        <p>No saved recipes found.</p>
      ) : (
        <ul>
          {savedRecipes.map((recipe) => (
            <li key={recipe._id}>
              <div>
                <h2>{recipe.name}</h2>
                <button className="unsave-btn" onClick={() => unsaveRecipe(recipe._id)}>Unsave</button>
              </div>
              <p>{recipe.description}</p>
              <p>{recipe.instructions}</p>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
