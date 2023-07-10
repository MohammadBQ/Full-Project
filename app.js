const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./api/User/user.routes");
const categoryRoutes = require("./api/Category/category.routes");
const ingredientRoutes = require("./api/Ingredient/ingredient.routes");
const recipeRoutes = require("./api/Recipe/recipe.routes");
const config = require("./config/keys");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");

app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

app.use(notFound);
app.use(errorHandler);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/ingredient", ingredientRoutes);
app.use("/recipe", recipeRoutes);
app.use("/media", express.static(path.join(__dirname, "media")));





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on PORT:${PORT}`);
});

module.exports = app;
