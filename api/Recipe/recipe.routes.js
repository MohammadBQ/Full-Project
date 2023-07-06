const express = require("express");
const passport = require("passport");
const router = express.Router();

const Recipe = require("../../models/Recipe");

const {
    getRecipe,
    deleteRecipe,
    addRecipe,
    getMyRecipes,
  } = require("./recipe.controllers");



router.param("recipeId", async (req, res, next, recipeId) => {
    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe)
        return res.status(404).json({
          msg: "There is not recipe with this id",
        });
      req.recipe = recipe;
      next();
    } catch (error) {
      next(error);
    }
  });
  
  router.get("/", getRecipe);
  router.post("/", passport.authenticate("jwt", { session: false }), addRecipe);

  router.get("/my-recipes", passport.authenticate("jwt", { session: false }), getMyRecipes);
  router.delete("/delete/:recipeId", passport.authenticate("jwt", { session: false }), deleteRecipe)

  module.exports = router;