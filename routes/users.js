const router = require("express").Router();
const {
  getUserProfile,
  updateImage,
  updateUserProfile,
} = require("../controllers/users");
const protect = require("../middlewares/auth");
const upload = require("../middlewares/multer");

router.get("/:username", [], getUserProfile);
router.put("/image", [protect, upload], updateImage);
router.put("/", [protect], updateUserProfile);

module.exports = router;
