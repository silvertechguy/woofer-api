const router = require("express").Router();
const { markNotificationsAsRead } = require("../controllers/notifications");
const protect = require("../middlewares/auth");

router.put("/", [protect], markNotificationsAsRead);

module.exports = router;
