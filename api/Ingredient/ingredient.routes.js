const express = require("express");
const passport = require("passport");



const router = express.Router();
const Ingredient = require("../../models/Ingredient");


const {
    getAllIngredients,
    addIngredient,
    addIngredientToRecipe,
} = require("./ingredient.controllers")




router.param("ingredientId", async (req, res, next, ingredientId) => {
    try {
      const ingredient = await Ingredient.findById(ingredientId);
      if (!ingredient)
        return res.status(404).json({
          msg: "There is not ingredient with this id",
        });
      req.ingredient = ingredient;
      next();
    } catch (error) {
      next(error);
    }
  });
  


router.get("/", getAllIngredients);

//router.get("/:recipe/ingredients", getCategoriesByRecipe);

router.post("/", passport.authenticate("jwt", { session: false }), addIngredient);

router.post("/:recipeId/:ingredientId", addIngredientToRecipe);

module.exports = router;
