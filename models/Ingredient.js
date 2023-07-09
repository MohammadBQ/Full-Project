const { model, Schema } = require("mongoose");

const IngredientSchema = new Schema({
  name: { type: String, unique: true, required: true },
  categories: [
    { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  ],
  recipes: [{ type: Schema.Types.ObjectId, required: true, ref: "Recipe" }],
});

module.exports = model("Ingredient", IngredientSchema);
