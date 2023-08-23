const Post = require("../models/postmodel");
const Comment = require("../models/commentmodel");

exports.createComment = async (request, response) => {
  try {
    const { post, user, body } = request.body;
    // create a object
    const comment = new Comment({
      post,
      user,
      body,
    });

    // save in database
    const savedComment = await comment.save();

    // update the comment field in post
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comment: savedComment._id } },
      { new: true }
    )
      .populate("comment")
      .populate("like")
      .exec();

    response.status(200).json({
      success: true,
      post: updatedPost,
      message: "Comment Added",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
