const { model, Schema } = require("mongoose");





const RecipeSchema = new Schema(
    {
    name: { type: String,  required: true },
    description: { type: String, required: true},
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }]
  
    // create relations in here and in the other model
  });
  
  module.exports = model("Recipe", RecipeSchema);