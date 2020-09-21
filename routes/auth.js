const router = require("express").Router();
const {
  register,
  login,
  getLoggedInUser,
  logout,
} = require("../controllers/auth");
const {
  validate,
  userRegisterValidationRules,
  userLoginValidationRules,
} = require("../utils/validator");
const protect = require("../middlewares/auth");

router.post("/register", [userRegisterValidationRules(), validate], register);
router.post("/login", [userLoginValidationRules(), validate], login);
router.get("/me", [protect], getLoggedInUser);
router.get("/logout", [protect], logout);

module.exports = router;
