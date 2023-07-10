const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String },
  password: { type: String, required: true },

  confirmpassword: {type: String, required: true},

  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }]})


module.exports = model("User", UserSchema);
