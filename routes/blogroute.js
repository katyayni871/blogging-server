const express = require("express");
const router = express.Router();

// import
const { createComment } = require("../controllers/commentcontroller");
const { createPost, getAllPost } = require("../controllers/postcontroller");
const { likePost, unlikePost } = require("../controllers/likecontroller");
const { login, signup } = require("../controllers/auth");
const { auth } = require("../middlewares/auth");

// map
router.post("/comments/create", createComment);
router.post("/posts/create", createPost);
router.get("/posts", getAllPost);
router.post("/likes/like", likePost);
router.post("/likes/unlike", unlikePost);
router.post("/signup", signup);
router.post("/login", login);

router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "Successfully tested",
  });
});

module.exports = router;
