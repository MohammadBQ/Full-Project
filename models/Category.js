const { model, Schema } = require("mongoose");

const CategorySchema = new Schema({


  name: { type: String, unique: true, required: true },
  ingredients: [
    { type: Schema.Types.objectId, required: true, ref: "Ingredient" },
  ],
  recipes: [{ type: Schema.Types.objectId, required: true, ref: "Recipe" }],

});

module.exports = model("Category", CategorySchema);
