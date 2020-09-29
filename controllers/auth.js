const bcrypt = require("bcryptjs");
const axios = require("axios");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

exports.register = async (req, res) => {
  try {
    const userEmail = await db.query(
      "SELECT user_email FROM users WHERE user_email = $1",
      [req.body.email]
    );

    if (userEmail.rows.length) {
      return res.status(400).json({ msg: "Email is already exists" });
    }

    const userName = await db.query(
      "SELECT user_username from users WHERE user_username = $1",
      [req.body.username]
    );

    if (userName.rows.length) {
      return res.status(400).json({ msg: "This Username is already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await db.query(
      "INSERT INTO users(user_username, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id AS id, user_username AS username, user_email AS email",
      [req.body.username, req.body.email, hashedPassword]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRE),
    });

    const userCredentails = JSON.stringify({
      id: newUser.rows[0].id,
      token,
      username: newUser.rows[0].username,
      email: newUser.rows[0].email,
    });

    redisClient.set(token, userCredentails);
    redisClient.expire(token, parseInt(process.env.JWT_EXPIRE));

    res.status(201).json({ token });

    if (process.env.SMS_SERVERLESS_LAMBDA_URL) {
      axios
        .post(process.env.SMS_SERVERLESS_LAMBDA_URL, {
          message: `${newUser.rows[0].username} - ${newUser.rows[0].email} Registered to your app Woofer`,
        })
        .then((res) => console.dir(res.data))
        .catch(console.log);
    }
  } catch (err) {
    // console.error("/api/auth/register", err);
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await db.query(
      "SELECT user_id AS id, user_username AS username, user_email AS email, user_password AS password FROM users WHERE user_email = $1",
      [req.body.email]
    );

    if (!user.rows.length) {
      return res.status(400).json({ msg: "Wrong credentials" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.rows[0].password
    );

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong credentials" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRE),
    });

    const userCredentails = JSON.stringify({
      id: user.rows[0].id,
      token,
      username: user.rows[0].username,
      email: user.rows[0].email,
    });

    redisClient.set(token, userCredentails);
    redisClient.expire(token, parseInt(process.env.JWT_EXPIRE));

    return res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json("Please Get token, Not authorized to access this route");
    }

    const userData = await db.query(
      "SELECT * FROM users WHERE users.user_username = $1",
      [req.user.username]
    );

    const likesOnPostsByMe = await db.query(
      "SELECT woof_id AS id, like_created_at AS createdat, like_id AS likeid FROM likes WHERE username = $1 ORDER BY like_created_at DESC",
      [req.user.username]
    );

    const myNotifications = await db.query(
      "SELECT notification_id AS id, notification_type AS type, notification_read AS read, notification_created_at AS createdat, notification_sender AS sender, notification_recipient AS recipient, notification_woof_id AS woof_id FROM notifications WHERE notification_recipient = $1 ORDER BY notification_created_at DESC LIMIT (10)",
      [req.user.username]
    );

    const user = {
      id: userData.rows[0].user_id,
      username: userData.rows[0].user_username,
      email: userData.rows[0].user_email,
      imageurl: userData.rows[0].user_image_url,
      createdat: userData.rows[0].user_created_at,
      bio: userData.rows[0].user_bio,
      website: userData.rows[0].user_website,
      location: userData.rows[0].user_location,
      likes: likesOnPostsByMe.rows,
      notifications: myNotifications.rows,
    };

    res.status(200).json(user);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
};

exports.logout = async (req, res) => {
  try {
    redisClient.del(req.user.token);
    res.status(200).json({ msg: "LogOut Successfully" });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
};
