import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://server-578r.onrender.com/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://server-578r.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("https://server-578r.onrender.com/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRecipe = async (recipeID) => {
    try {
      const response = await axios.delete(`https://server-578r.onrender.com/recipes/${recipeID}/${userID}`);
      if (response.status === 200) {
        alert("Recipe deleted successfully");
        setRecipes(recipes.filter(recipe => recipe._id !== recipeID));
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name} </h2>
              <h3>by  {recipe.creator}</h3>
              <p className="text-ingredients">Ingredients: {recipe.ingredients.join(", ")}</p>
              
              <button
                className="save-btn"
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p className="text-instruction" >{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
            
            {userID === recipe.userOwner && (
              <button className="delete-btn" onClick={() => deleteRecipe(recipe._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
