const { body } = require("express-validator");

exports.registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),

  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

exports.bookValidator = [
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("src").trim().notEmpty().withMessage("Book source is required"),
  body("description").notEmpty().withMessage("Book description is required"),
];
