const { model, Schema } = require("mongoose");

const IngredientSchema = new Schema ({
    name:{type: String, required: true},
})












module.exports = model("Ingredient",IngredientSchema)