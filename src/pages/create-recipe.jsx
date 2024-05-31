import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    creator: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!recipe.name) newErrors.name = "Recipe name is required";
    if (!recipe.creator) newErrors.creator = "Creator name is required";
    if (!recipe.instructions) newErrors.instructions = "Instructions are required";
    if (!recipe.imageUrl) newErrors.imageUrl = "Image URL is required";
    if (recipe.cookingTime <= 0) newErrors.cookingTime = "Cooking time must be a positive number";
    if (recipe.ingredients.length === 0 || recipe.ingredients.includes("")) {
      newErrors.ingredients = "At least one ingredient is required";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post(
        "https://server-578r.onrender.com/recipes",
        { ...recipe },
        {
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Recipe Created");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!userID) {
    return <div className="login-text"><b>You need to log in to create a recipe.</b></div>;
  }

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Recipe Name<span className="required">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        
        <label htmlFor="creator">Creator Name<span className="required">*</span></label>
        <input
          type="text"
          id="creator"
          name="creator"
          value={recipe.creator}
          onChange={handleChange}
        />
        {errors.creator && <span className="error">{errors.creator}</span>}
        
        <label htmlFor="ingredients">Ingredients<span className="required">*</span></label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, index)}
          />
        ))}
        {errors.ingredients && <span className="error">{errors.ingredients}</span>}
        <button className="recipe-btn" type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>
        
        <label htmlFor="instructions">Instructions<span className="required">*</span></label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        ></textarea>
        {errors.instructions && <span className="error">{errors.instructions}</span>}
        
        <label htmlFor="imageUrl">Image URL<span className="required">*</span></label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
        />
        {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
        
        <label htmlFor="cookingTime">Cooking Time (minutes)<span className="required">*</span></label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
        />
        {errors.cookingTime && <span className="error">{errors.cookingTime}</span>}
        
        <button className="recipe-btn" type="submit">Create Recipe</button>
      </form>
    </div>
  );
};
