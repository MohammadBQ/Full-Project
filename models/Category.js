const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const CategorySchema = new Schema({
  name: { type: String,  required: true },
  
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }]

  // create relations in here and in the other model
});

module.exports = model("Category", CategorySchema);
