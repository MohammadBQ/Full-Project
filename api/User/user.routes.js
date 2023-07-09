const express = require("express");
const {
  getUser,
  deleteUser,
  fetchUser,
  signin,
  signup,
} = require("./user.controllers");
const router = express.Router();
const passport = require("passport");

// Everything with the word temp is a placeholder that you'll change in accordance with your project

router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.user = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getUser);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.post("/signup",  signup);

router.delete("/:userId", deleteUser)

module.exports = router;
