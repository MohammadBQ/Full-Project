const Recipe = require("../../models/Recipe");
const Category = require("../../models/Category");
const User = require("../../models/User");


exports.fetchRecipe = async (recipeId, next) => {
    try {
      const recipe1 = await Recipe.findById(recipeId);
      return recipe1;
    } catch (error) {
      return next(error);
    }
  };


  exports.addRecipe = async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(403)
          .json({ error: "You can't add a recipe" });
        // 403 = Forbidden
      }
      const recipe = await Recipe.create(req.body);
      res.status(201).json(recipe);
      next(error);
    } catch (error) {
      next(error);
    }
  };


  exports.getRecipe = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
      console.log(req.user.recipes);
  
      const recipes = await User.findById(req.user._id)
        .select("_id username recipes")
        .populate({
          path: "recipes",
          populate: { path: "category", select: "name" },
          select: "-user",
        });


    const count = await Recipe.countDocuments();

    return res.status(200).json({
    recipes,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
} catch (error) {
  return next(error);
}
};


exports.getMyRecipes = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      console.log(req.user.recipes);
  
      const recipes = await User.findById(req.user._id)
        .select("_id username recipes")
        .populate({
          path: "recipes",
          populate: { path: "category", select: "name" },
          select: "-user",
        });
     
      const count = await Recipe.countDocuments();
  
      if (recipes.length <= 0)
        return res.status(200).json({ message: "There are no recipes to view" });
  
      return res.status(200).json({
        recipes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (error) {
      return next(error);
    }
};



exports.deleteRecipe = async (req, res, next) => {
    try {
      if (!req.user._id.equals(req.recipe.userId._id))
        return next({ status: 401, message: "You can not delete other persons recipe" });
  
      await req.review.deleteOne();
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  };
  
