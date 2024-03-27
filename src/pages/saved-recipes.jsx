import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://server-578r.onrender.com/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const unsaveRecipe = async (recipeID) => {
    try {
      await axios.delete(`https://server-578r.onrender.com/recipes/savedRecipes/${recipeID}/${userID}`);
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeID));
      alert("Recipe unsaved successfully");
    } catch (err) {
      alert("Error unsaving recipe:", err);
    }
  };

  return (
    <div>
      <h1>Saved Recipes</h1>
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
    </div>
  );
};
