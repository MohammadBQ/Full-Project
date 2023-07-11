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
      
      const recipe = await Recipe.create(req.body);
      res.status(201).json(recipe);
      next(error);
    } catch (error) {
      
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
    }git 
  };
  
  exports.updateRecipe = async (req, res, next) => {
    try {
      if (!req.user._id.equals(req.recipe.creator)) {
        return next({
          status: 400,
          message: "You can't update the recipe",
        });
      }
      if (req.file) {
        req.body.recipeimage = `${req.file.path.replace("\\", "/")}`;
      }
  
      if (!req.body.image)
        return next({ status: 400, message: "No image is added to the recipe" });
  
      if (req.body.image?.length < 5) {
        req.body.image = "media/defaultImage.png";
      }
      const oldRecipe = await Recipe.findById(req.recipe._id).populate(
        "categories ingredients"
      );
  
      const oldCategories = oldRecipe.categories.map((cat) =>
        cat.name.toLowerCase()
      );
  
      const oldIngredients = oldRecipe.ingredients.map((ing) =>
        ing.name.toLowerCase()
      );
      const newCategories = (req.body.categories || []).map((cat) =>
        cat.toLowerCase()
      );
      const newIngredients = (req.body.ingredients || []).map((ing) =>
        ing.toLowerCase()
      );
      console.log(oldCategories, newCategories);
      const categoriesToAdd = newCategories;
      const categoriesToRemove = oldCategories.filter(
        (cat) => !newCategories.includes(cat.toLowerCase())
      );
  
      const ingredientsToAdd = newIngredients;
      const ingredientsToRemove = oldIngredients.filter(
        (ing) => !newIngredients.includes(ing.toLowerCase())
      );
  
      const categoryUpdates = [];
      const ingredientUpdates = [];
      
      for (let categoryName of categoriesToAdd) {
        categoryUpdates.push(
          Category.findOneAndUpdate(
            { name: categoryName.toLowerCase() },
            { $addToSet: { recipes: req.recipe._id } },
            { new: true, upsert: true }
          )
        );
      }
  
      for (let ingredientName of ingredientsToAdd) {
        ingredientUpdates.push(
          Ingredient.findOneAndUpdate(
            { name: ingredientName.toLowerCase() },
            { $addToSet: { recipes: req.recipe._id } },
            { new: true, upsert: true }
          )
        );
      }
  
      const addedCategories = await Promise.all(categoryUpdates);
      const addedIngredients = await Promise.all(ingredientUpdates);
  
      
      const newCategoriesIds = addedCategories.map((category) => category._id);
      const newIngredientsIds = addedIngredients.map(
        (ingredient) => ingredient._id
      );
  
      await req.recipe.updateOne({
        $push: {
          categories: { $each: newCategoriesIds },
          ingredients: { $each: newIngredientsIds },
        },
      });
  
      // Remove old categories and ingredients from recipe and recipe from category and ingredient
      for (let categoryName of categoriesToRemove) {
        const foundCategory = await Category.findOne({ name: categoryName });
        if (foundCategory) {
          await foundCategory.updateOne({ $pull: { recipes: req.recipe._id } });
          await req.recipe.updateOne({
            $pull: { categories: foundCategory._id },
          });
        }
      }
  
      for (let ingredientName of ingredientsToRemove) {
        const foundIngredient = await Ingredient.findOne({
          name: ingredientName,
        });
        if (foundIngredient) {
          await foundIngredient.updateOne({ $pull: { recipes: req.recipe._id } });
          await req.recipe.updateOne({
            $pull: { ingredients: foundIngredient._id },
          });
        }
      }
  
      // Update the recipe
      req.body.categories = newCategoriesIds;
      req.body.ingredients = newIngredientsIds;
  
      const updatedRecipe = await req.recipe
        .updateOne(req.body, { new: true })
        .populate("categories ingredients");
      return res.status(201).json(updatedRecipe);
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  };
  
