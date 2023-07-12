const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../../middlewares/uploader");
const Recipe = require("../../models/Recipe");

const {
    getRecipes,
    deleteRecipe,
    getRecipeById,
    updateRecipe,
    fetchRecipe,
    createRecipe,
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
  
  router.get("/", getRecipes);
  router.get("/:recipeId", getRecipeById);
  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),upload.single("image"),
    createRecipe
  );
  router.put(
    "/:recipeId",
    passport.authenticate("jwt", { session: false }),upload.single("image"),
    updateRecipe
  );
  
  router.delete("/delete/:recipeId", passport.authenticate("jwt", { session: false }), deleteRecipe);

  module.exports = router;