const User = require("../../models/User");
const passHash = require("../../utils/auth/passhash");
const generateToken = require("../../utils/auth/generateToken");

// Everything with the word temp is a placeholder that you'll change in accordance with your project

exports.fetchUser = async (userId, next) => {
  try {
    const user1 = await User.findById(userId);
    return user1;
  } catch (error) {
    return next(error);
  }
};
cd 
exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v -password");
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};


exports.getProfile = async (req, res, next) => {
  try {
    const users = await User.find({ _id: req.user._id }).select(
      "-__v -password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    req.body.password = await passHash(password);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.signup = async (req, res, next) => {
  try {

    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if(!req.user._id.equals(req.foundUser._id)) return next({ status: 400, message: " You are not permitted to update the user" })
       if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    await User.findByIdAndUpdate(req.user.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};


exports.deleteUser = async (req, res, next) => {
  try {
    if(!req.user._id.equals(req.foundUser._id)) return next({ status: 400, message: "You cannot delete other users " })
    await User.findByIdAndRemove({ _id: req.user.id });
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};