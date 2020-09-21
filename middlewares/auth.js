const redisClient = require("../config/redis");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        msg: "Not authorized to access this route (no token given in header)",
      });
    }

    const verifyToken = () => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err && err.name == "TokenExpiredError") {
            return reject(err);
          }

          return resolve(decoded.id);
        });
      });
    };

    const userId = await verifyToken();

    const getUserByTokenFromRedis = () => {
      return new Promise((resolve, reject) => {
        redisClient.hgetall(userId, (err, value) => {
          if (value === null) {
            // console.log("value of (redisClient.hgetall(userId))", value);
            return res.status(401).json({
              msg:
                "Not authorized to access this route (There is no value or key(id) in Redis)",
            });
          }

          if (err) {
            // console.error("redisClient.hgetall", err);
            return reject(err);
          }

          if (token == value.token) {
            return resolve(value);
          } else {
            res
              .status(401)
              .json({ msg: "Not authorized to access this route" });
          }
        });
      });
    };

    const user = await getUserByTokenFromRedis();

    const userQueryResult = await db.query(
      "SELECT user_id AS id, user_username AS username, user_email AS email FROM users WHERE user_username = $1",
      [user.username]
    );

    req.user = userQueryResult.rows[0];

    next();
  } catch (err) {
    // console.log("Error while verifying token ", err);
    res.status(401).json({ msg: "Not authorized to access this route" });
  }
};

module.exports = protect;
