const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const authToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

exports.register = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });

  const { role, name, email, password, preferredCategories } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        message: "User with this email already exists, try another one",
      });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({
      role,
      name,
      email,
      password: hashed,
      preferredCategories,
    });
    await user.save();
    const token = authToken(user._id);
    return res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        preferredCategories: user.preferredCategories,
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.login = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("preferredCategories");

    if (!user) return res.status(404).json({ error: "Invalid Credentials" });
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(404).json({ error: "Invalid Credentials" });

    const token = authToken(user._id);
    return res.status(200).json({
      token,
      status: "success",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        preferredCategories: user.preferredCategories, // ✅ include populated data
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error, message: "server error" });
  }
};
