const router = require("express").Router();
const {
  createWoof,
  getWoofByID,
  getAllWoofs,
  deleteWoofByID,
  addComment,
  deleteCommentById,
  likeWoofById,
  unLikeWoofById,
} = require("../controllers/woofs");
const protect = require("../middlewares/auth");
const {
  validate,
  woofAddValidationRules,
  commentAddValidationRules,
} = require("../utils/validator");

router.post("/", [protect, woofAddValidationRules(), validate], createWoof);
router.get("/", getAllWoofs);
router.get("/:woofid", getWoofByID);
router.delete("/:woofid", [protect], deleteWoofByID);
router.post(
  "/:woofid/comment",
  [protect, commentAddValidationRules(), validate],
  addComment
);
router.delete("/:woofid/comment/:commentid", [protect], deleteCommentById);
router.get("/:woofid/like", [protect], likeWoofById);
router.get("/:woofid/unlike", [protect], unLikeWoofById);

module.exports = router;
