const db = require("../config/db");
const path = require("path");
const { userUpdateProfileValidationRules } = require("../utils/validator");
const s3 = require("../config/aws-s3");

exports.getUserProfile = async (req, res) => {
  try {
    const userData = await db.query(
      "SELECT user_id AS id, user_username AS username, user_email AS email, user_image_url AS imageurl, user_created_at AS createdat, user_bio AS bio, user_website AS website, user_location AS location FROM users WHERE user_username = $1",
      [req.params.username]
    );

    if (!userData.rows.length) {
      return res.status(401).json({ errror: "User not found" });
    }

    const woofsResult = await db.query(
      "SELECT woofs.woof_id AS id, woofs.woof_body AS body, woofs.username AS username, users.user_image_url AS imageUrl, woofs.woof_created_at AS createdAt, (SELECT COUNT(*) FROM comments WHERE woofs.woof_id = comments.woof_id) AS commentsCount, (SELECT COUNT(*) FROM likes WHERE woofs.woof_id = likes.woof_id) AS likesCount FROM woofs JOIN users ON woofs.username = users.user_username WHERE users.user_username = $1 ORDER BY woof_created_at DESC",
      [req.params.username]
    );

    const user = {
      id: userData.rows[0].id,
      username: userData.rows[0].username,
      email: userData.rows[0].email,
      imageurl: userData.rows[0].imageurl,
      bio: userData.rows[0].bio,
      website: userData.rows[0].website,
      location: userData.rows[0].location,
      createdat: userData.rows[0].createdat,
      woofs: woofsResult.rows,
    };

    res.status(200).json(user);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
};

exports.updateImage = async (req, res) => {
  try {
    let image = req.file;

    if (!image) {
      return res.status(400).json({ msg: "Please upload an image" });
    }

    if (!image.mimetype.startsWith("image")) {
      return res.status(400).json({ msg: "Please upload an image file" });
    }

    if (image.size > process.env.MAX_IMAGE_UPLOAD) {
      return res.status(400).json({
        msg: `Please upload an image less than ${process.env.MAX_IMAGE_UPLOAD}`,
      });
    }

    image.originalname = `${image.originalname.split(".")[0]}-${Math.round(
      Math.random() * 1e9
    ).toString()}${path.parse(image.originalname).ext}`;

    const getPhotoUrl = () => {
      return new Promise((resolve, reject) => {
        s3.upload(
          {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image.originalname,
            Body: image.buffer,
          },
          (err, data) => {
            if (err) {
              console.log(err);
              return reject(err);
            }

            return resolve(data.Location);
          }
        );
      });
    };

    const AWSS3StorageUserImageUrl = await getPhotoUrl();

    const user = await db.query(
      "UPDATE users SET user_image_url = $1 WHERE user_username = $2 RETURNING user_image_url",
      [AWSS3StorageUserImageUrl, req.user.username]
    );

    return res.json({
      imageurl: user.rows[0].user_image_url,
      msg: "image uploaded successfully",
    });
  } catch (err) {
    console.error("err.message", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { bio, location, website } = userUpdateProfileValidationRules(req);

    await db.query(
      "UPDATE users SET user_bio = $1, user_location = $2, user_website = $3 WHERE user_username = $4",
      [bio, location, website, req.user.username]
    );

    return res.json({ msg: "User Profile Updated Successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.message.includes("Invalid URL")) {
      return res.status(500).json({ msg: err.message });
    }
    res.status(500).json({ errorCode: err.code, msg: "Server Error" });
  }
};
