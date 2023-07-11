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
  exports.getCategory = async (req, res, next) => {
    try {
      const categories = await Category.find()
        .select("-__v")
        .populate("recipes", "name");
      return res.status(200).json(categories);
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  };
  
  exports.createCategory = async (req, res, next) => {
    try {
      req.body.addedBy = req.user._id;
      const newCategory = await Category.create(req.body);
      return res.status(201).json(newCategory);
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  };
  exports.recipesByCategory = async (req, res, next) => {
    try {
      const category = req.category;
  
      const recipes = await Recipe.find({ categories: category }).populate(
        "categories"
      );
  
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteCategory = async (req, res, next) => {
      try {
        await req.category.deleteOne();
         return res.status(204).end();
       } catch (error) {
        return next({ status: 400, message: error.message });
       }
     };