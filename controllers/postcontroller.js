const Post = require("../models/postmodel");
const cloudinary = require("cloudinary").v2;

const cloudinaryUpload = async (file, folder) => {
  const options = { folder };
  options.resourse_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.createPost = async (request, response) => {
  try {
    const { title, body, tags } = request.body;
    const file = request.files.imageFile;

    const res = await cloudinaryUpload(file, "Blogging");

    const post = new Post({
      title,
      body,
      tags,
      imageUrl: res.secure_url,
    });
    const savedPost = await post.save();

    response.status(200).json({
      success: true,
      post: savedPost,
      message: "Post Created",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllPost = async (request, response) => {
  try {
    const allPost = await Post.find({}).populate("comment").populate("like");
    if (!allPost)
      return response.status(404).json({
        post: null,
        message: "No Post Found",
      });
    response.status(500).json({
      post: allPost,
      message: "Post Found",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      post: null,
      message: err.message,
    });
  }
};
