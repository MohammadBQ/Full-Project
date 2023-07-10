const Category = require("../../models/Category");
const Recipe = require("../../models/Recipe");


exports.getAllCategories = async (req, res, next) => {
    try {
      const categories = await Category.find().populate("recipes");
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
  
  exports.addCategory = async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(403)
          .json({ error: "You need to be signed in to add a category!" });
        // 403 = Forbidden
      }
      const category = await Category.create(req.body);
      res.status(201).json(category);
      next(error);
    } catch (error) {
      next(error);
    }
  };
  
  exports.addRecipeToCategory = async (req, res, next) => {
    try {
      const { recipeId } = req.params; // i can create a route.param
      const recipe = await Recipe.findById(recipeId);
  
      await Category.findByIdAndUpdate(req.category._id, {
        $push: { recipes: recipe._id },
      }); // so we are takeing the tag and put it in the post
  
      await Recipe.findByIdAndUpdate(recipeId, {
        $push: { categories: req.category._id },
      });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
  
  exports.getCategoriesByRecipe = async (req, res, next) => {
    try {
      const recipeName = req.params.recipe;
      //fetch the recipe document by its name
      const recipe= await Recipe.findOne({ name: recipeName });
      if (!recipe) {
        return res.status(404).json({ error: " Recipe Not found !!" });
      }
  
      // Then, fetch all recipes that reference this category
      const categories = await Category.find({ recipes: recipe._id });
  
      // At last, send the recipes back in the response
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };
  