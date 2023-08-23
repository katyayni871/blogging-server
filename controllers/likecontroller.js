const Post = require("../models/postmodel");
const Like = require("../models/likemodel");

exports.likePost = async (request, response) => {
  try {
    const { post, user } = request.body;
    const like = new Like({
      post,
      user,
    });
    const savedLike = await like.save();
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { like: savedLike._id } },
      { new: true }
    )
      .populate("like")
      .populate("comment")
      .exec();

    response.status(200).json({
      success: true,
      post: updatedPost,
      message: "Liked the post",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.unlikePost = async (request, response) => {
  try {
    const { post, like } = request.body;
    const unlikedPost = await Like.findOneAndDelete({ post: post, _id: like });
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $pull: { likes: unlikedPost._id } },
      { new: true }
    )
      .populate("likes")
      .populate("comment")
      .exec();
    response.status(200).json({
      success: true,
      post: updatedPost,
      message: "Unliked the post",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
