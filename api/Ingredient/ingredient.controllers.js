const Ingredient = require("../../models/Ingredient");
const Recipe = require("../../models/Recipe");
const User = require("../../models/User");


exports.fetchIngredient = async (ingredientId, next) => {
    try {
      const ingredient = await Ingredient.findById(ingredientId);
      return ingredient;
    } catch (error) {
      return next(error);
    }
  };



  exports.getAllIngredients = async (req, res, next) => {
    try {
      // Populate here
      const ingredients = await Ingredient.find().populate("recipes");
      return res.status(200).json(ingredients);
    } catch (error) {
      return next(error);
    }
  };






exports.addIngredient = async (req, res, next) => {
  try {
    
    const newIngredient = await Ingredient.create(req.body);
    res.status(201).json(newIngredient);
    next(error);
  } catch (error) {
    next(error);
  }
};



exports.deleteIngredientById = async (req, res, next) => {
    try {
      await req.ingredient.deleteOne();
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  };
  


exports.addIngredientToRecipe = async (req, res, next) => {
    try {
      const { recipeId } = req.params; // i can create a route.param
      const recipe = await Recipe.findById(recipeId);
  
      await Ingredient.findByIdAndUpdate(req.ingredient._id, {
        $push: { recipes: recipe._id },
      }); // so we are takeing the tag and put it in the post
  
      await Recipe.findByIdAndUpdate(recipeId, {
        $push: { ingredients: req.ingredient._id },
      });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };