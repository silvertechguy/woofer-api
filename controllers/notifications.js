const db = require("../config/db");

exports.markNotificationsAsRead = async (req, res) => {
  try {
    await db.query(
      "UPDATE notifications SET notification_read = TRUE FROM UNNEST ($1::UUID[]) AS array_of_ids WHERE notifications.notification_id = array_of_ids",
      [req.body]
    );

    return res.status(200).json({ msg: "Notification marked" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: err.code });
  }
};
