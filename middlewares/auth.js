// we will create 3 middleware => auth, isStudent, isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (request, response, next) => {
  try {
    //get token
    const token = request.body.token;
    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    //decode the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      request.user = decode;
    } catch (err) {
      console.log(err);
      return response.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // to go the next parameter
    next();
  } catch (err) {
    return response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
