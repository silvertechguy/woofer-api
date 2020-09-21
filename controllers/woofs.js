const db = require("../config/db");

exports.createWoof = async (req, res) => {
  try {
    const newWoofResult = await db.query(
      "WITH inserted_woof AS (INSERT INTO woofs (woof_body, username) VALUES ($1, $2) RETURNING *) SELECT inserted_woof.woof_id AS id, inserted_woof.woof_body AS body, inserted_woof.username AS username, inserted_woof.woof_created_at AS createdAt, users.user_image_url AS imageUrl FROM inserted_woof JOIN users ON inserted_woof.username = users.user_username",
      [req.body.body, req.user.username]
    ); // Did the CTE and Join to get user info(userImageURL)

    const newWoof = {
      id: newWoofResult.rows[0].id,
      body: newWoofResult.rows[0].body,
      username: newWoofResult.rows[0].username,
      createdat: newWoofResult.rows[0].createdat,
      imageurl: newWoofResult.rows[0].imageurl,
      commentscount: 0,
      likescount: 0,
    };

    return res.status(201).json(newWoof);
  } catch (err) {
    // console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getAllWoofs = async (req, res) => {
  try {
    const woofsResult = await db.query(
      "SELECT woofs.woof_id AS id, woofs.woof_body AS body, woofs.username AS username, woofs.woof_created_at AS createdAt, users.user_image_url AS imageUrl, (SELECT COUNT(*) FROM comments WHERE woofs.woof_id = comments.woof_id) AS commentsCount,  (SELECT COUNT(*) FROM likes WHERE woofs.woof_id = likes.woof_id) AS likesCount FROM woofs JOIN users ON woofs.username = users.user_username ORDER BY woof_created_at DESC"
    ); // Did the Join to get user info(userImageURL)

    res.status(200).json(woofsResult.rows);
  } catch (err) {
    // console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getWoofByID = async (req, res) => {
  try {
    const woof = await db.query(
      "SELECT user_image_url imageurl, woof_id id, woof_body body, woof_created_at createdat, username, (SELECT COUNT(*) FROM likes WHERE likes.woof_id = $1) AS likescount, (SELECT COUNT(*) FROM comments WHERE comments.woof_id = $1) AS commentscount FROM users JOIN woofs ON users.user_username = woofs.username WHERE woof_id = $1",
      [req.params.woofid]
    );

    if (!woof.rows.length) {
      return res.status(400).json({ error: "Woof not found" });
    }

    const woofComments = await db.query(
      "SELECT comment_body body, comment_created_at createdAt, username username, woof_id woofid, comment_id commentid, user_image_url imageurl FROM comments JOIN users ON username = users.user_username WHERE woof_id = $1 ORDER BY comment_created_at DESC",
      [req.params.woofid]
    );

    const woofData = {
      id: woof.rows[0].id,
      body: woof.rows[0].body,
      username: woof.rows[0].username,
      imageurl: woof.rows[0].imageurl,
      createdat: woof.rows[0].createdat,
      likescount: woof.rows[0].likescount,
      commentscount: woof.rows[0].commentscount,
      comments: woofComments.rows,
    };

    res.status(200).json(woofData);
  } catch (err) {
    // console.error(err);
    if (err.code === "22P02")
      return res.status(400).json({ msg: "Woof not found" });
    res.status(500).json({ errorCode: err.code, msg: "Server Error" });
  }
};

exports.deleteWoofByID = async (req, res) => {
  try {
    const woof = await db.query(
      "SELECT woof_id id, username FROM woofs WHERE woof_id = $1",
      [req.params.woofid]
    );

    if (!woof.rows.length) {
      return res.status(400).json({ msg: "Woof not found" });
    }

    if (woof.rows[0].username !== req.user.username) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await db.query("DELETE FROM woofs WHERE woof_id = $1", [woof.rows[0].id]);

    res.json({ msg: "Woof deleted successfully" });
  } catch (err) {
    // console.error(err);
    if (err.code === "22P02")
      return res.status(400).json({ msg: "Woof not found" });
    res.status(500).json({ errorCode: err.code, msg: "Server Error" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const woof = await db.query(
      "SELECT woof_id id, username FROM woofs WHERE woof_id = $1",
      [req.params.woofid]
    );

    if (!woof.rows.length) {
      return res.status(400).json({ msg: "Woof not found" });
    }

    const newComment = await db.query(
      "WITH inserted_comment AS (INSERT INTO comments (comment_body, woof_id, username) VALUES ($1, $2, $3) RETURNING comment_id commentid, comment_body body, comment_created_at createdat, username, woof_id woofid) SELECT commentid, body, createdat, username, woofid, user_image_url imageurl FROM inserted_comment JOIN users ON username = users.user_username",
      [req.body.body, woof.rows[0].id, req.user.username]
    );

    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    // console.error(err);
    if (err.code === "22P02")
      return res.status(400).json({ msg: "Woof not found" });
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteCommentById = async (req, res) => {
  try {
    const woof = await db.query(
      "SELECT woof_id id, username FROM woofs WHERE woof_id = $1",
      [req.params.woofid]
    );

    if (!woof.rows.length) {
      return res.status(400).json({ msg: "Woof not found" });
    }

    const comment = await db.query(
      "SELECT comment_id id, woof_id woofid, username FROM comments WHERE comment_id = $1",
      [req.params.commentid]
    );

    if (!comment.rows.length) {
      return res.status(400).json({ msg: "Comment not found" });
    }

    const commentOfWoof = await db.query(
      "SELECT * FROM woofs JOIN comments USING (woof_id) WHERE woofs.woof_id = $1 AND comments.woof_id = $2",
      [woof.rows[0].id, comment.rows[0].woofid]
    );

    if (!commentOfWoof.rows.length) {
      return res.status(400).json({
        msg: `There is no such comment in this ${req.params.woofid} Woof`,
      });
    }

    if (comment.rows[0].username !== req.user.username) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await db.query("DELETE FROM comments WHERE comment_id = $1", [
      comment.rows[0].id,
    ]);

    res.json({ msg: "Comment deleted successfully" });
  } catch (err) {
    // console.error(err);
    if (err.code === "22P02")
      return res.status(400).json({ msg: "Resource not found" });
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.likeWoofById = async (req, res) => {
  try {
    const woof = await db.query(
      "SELECT woof_id id, username FROM woofs WHERE woof_id = $1",
      [req.params.woofid]
    );

    if (!woof.rows.length) {
      return res.status(400).json({ msg: "Woof not found" });
    }

    const like = await db.query(
      "SELECT like_id id FROM likes WHERE woof_id = $1 AND username = $2",
      [woof.rows[0].id, req.user.username]
    );

    if (like.rows.length) {
      return res.status(400).json({ msg: "Woof already liked" });
    }

    await db.query("INSERT INTO likes (woof_id, username) VALUES ($1, $2)", [
      woof.rows[0].id,
      req.user.username,
    ]);

    const woofLikes = await db.query(
      "SELECT COUNT(*) likescount FROM likes WHERE likes.woof_id = $1",
      [woof.rows[0].id]
    );

    return res.json(woofLikes.rows[0]);
  } catch (err) {
    // console.error(err);
    if (err.code === "22P02")
      return res.status(400).json({ msg: "Woof not found" });
    res.status(500).json({ errorCode: err.code, msg: "Server Error" });
  }
};

exports.unLikeWoofById = async (req, res) => {
  try {
    const woof = await db.query(
      "SELECT woof_id id, username FROM woofs WHERE woof_id = $1",
      [req.params.woofid]
    );

    if (!woof.rows.length) {
      return res.status(400).json({ msg: "Woof not found" });
    }

    const like = await db.query(
      "SELECT like_id id FROM likes WHERE woof_id = $1 AND username = $2",
      [woof.rows[0].id, req.user.username]
    );

    if (like.rows.length) {
      await db.query("DELETE FROM likes WHERE woof_id = $1 AND username = $2", [
        woof.rows[0].id,
        req.user.username,
      ]);

      const unlike = await db.query(
        "SELECT COUNT(*) likescount FROM likes WHERE woof_id = $1",
        [woof.rows[0].id]
      );

      return res.json(unlike.rows[0]);
    }

    return res.status(400).json({ msg: "Woof has not been liked yet" });
  } catch (err) {
    // console.error(err);
    if (err.code === "22P02")
      return res.status(400).json({ msg: "Woof not found" });
    res.status(500).json({ errorCode: err.code, msg: "Server Error" });
  }
};
