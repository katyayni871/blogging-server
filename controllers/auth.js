const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudinaryUpload = async (file, folder) => {
  const options = { folder };
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.signup = async (request, response) => {
  try {
    const { name, email, password, contactNumber, profession, hobbies } =
      request.body;
    const file = request.files.imageFile;
    const existingUser = await User.findOne({ email });

    // check existing user
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "Account already exist",
      });
    }
    // created hashed password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return response.status(500).json({
        success: false,
        message: err.message,
      });
    }

    const res = await cloudinaryUpload(file, "Profile");
    // Create user object
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      hobbies,
      profession,
      imageUrl: res.secure_url,
    });

    // final resposne
    return response.status(200).json({
      success: true,
      message: "Account successfully created.",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;

    //Validation
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Empty Field",
      });
    }

    // Find the account
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    // create a token and check the password
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      // Send the response with cookie
      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      response.cookie("auth", token, option).status(200).json({
        success: true,
        user,
        token,
        message: "User Logged In",
      });
    } else {
      return response.status(402).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
