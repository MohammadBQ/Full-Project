const { model, Schema } = require("mongoose");

const RecipeSchema = new Schema({
  name: { type: String, unique: true, required: true },
  instructions: { type: String, required: true },
  ingredients: [
    { type: Schema.Types.ObjectId, required: true, ref: "Ingredient" },
  ],
  categories: [
    { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  ],
});

module.exports = model("Recipe", RecipeSchema);
