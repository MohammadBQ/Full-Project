const express = require("express");
const passport = require("passport");



const router = express.Router();
const Category = require("../../models/Category");


const {
    getAllCategories,
    addCategory,
    addRecipeToCategory,
    getCategoriesByRecipe,
} = require("./category.controllers")




router.param("categoryId", async (req, res, next, categoryId) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category)
        return res.status(404).json({
          msg: "There is not category with this id",
        });
      req.category = category;
      next();
    } catch (error) {
      next(error);
    }
  });
  


router.get("/", getAllCategories);

router.get("/:recipe/categories", getCategoriesByRecipe);

router.post("/", passport.authenticate("jwt", { session: false }), addCategory);

router.post("/:categoryId/:recipeId", addRecipeToCategory);

module.exports = router;
