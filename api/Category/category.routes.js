const express = require("express");
const passport = require("passport");



const router = express.Router();

const Category = require("../../models/Category");


const {
    getAllCategories,
    createCategory,
    addRecipeToCategory,
    getCategoriesByRecipe,
    deleteCategory,
    recipesByCategory,
    addCategory,
    getCategory,


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

router.get("/", getCategory);
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    createCategory
    );
router.get(
        "/:categoryId",
      
        recipesByCategory
      );
router.get("/:recipe/categories", getCategoriesByRecipe);

//router.post("/", passport.authenticate("jwt", { session: false }), addCategory);

router.post("/:categoryId/:recipeId", addRecipeToCategory);
router.delete(
       "/:categoryId",
       passport.authenticate("jwt", { session: false }),
      deleteCategory
    );


    module.exports = router;
