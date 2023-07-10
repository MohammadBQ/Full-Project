const { model, Schema } = require("mongoose");

const CategorySchema = new Schema({
  name: { type: String, unique: true, required: true },
  ingredients: [
    { type: Schema.Types.ObjectId, required: true, ref: "Ingredient" },
  ],

  recipes: [{ type: Schema.Types.objectId, required: true, ref: "Recipe" }],
  categoryimage: { type: String, required: true }, 


module.exports = model("Category", CategorySchema);
