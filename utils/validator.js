const { body, validationResult } = require("express-validator");
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require("normalize-url");

const validate = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    const errors = {};

    validationResult(req)
      .array()
      .map((err) => ({ [err.param]: err.msg }))
      .map((elem) => (errors[Object.keys(elem)[0]] = Object.values(elem)[0]));

    return res.status(422).json(errors);
  }

  return next();
};

const userRegisterValidationRules = () => [
  body("username", "Please include a username; it's required").not().isEmpty(),
  body("email", "Please include a valid email").isEmail(),
  body(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  body("confirmpassword", "Please enter the confirmation password").custom(
    (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }
  ),
];

const userLoginValidationRules = () => [
  body("email", "Please include a valid email").isEmail(),
  body("password", "Please provide a password").notEmpty(),
];

const userUpdateProfileValidationRules = (req) => {
  return {
    bio: req.body.bio === undefined ? req.body.bio : req.body.bio.trim(),
    location:
      req.body.location === undefined ? req.body.bio : req.body.location.trim(),
    website:
      req.body.website === undefined
        ? ""
        : req.body.website === ""
        ? ""
        : normalize(req.body.website),
  };
};

const commentAddValidationRules = () => [
  body("body", "Please provide a comment body").notEmpty(),
];

const woofAddValidationRules = () => [
  body("body", "Please provide a Woof body").notEmpty(),
];

module.exports = {
  validate,
  userRegisterValidationRules,
  userLoginValidationRules,
  userUpdateProfileValidationRules,
  commentAddValidationRules,
  woofAddValidationRules,
};
