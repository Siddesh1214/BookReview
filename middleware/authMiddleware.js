const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = async (req, res,next) => {
  try {
    const token =
			req.cookies.token ||
			req.body.token ||
      (authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null);

    // console.log('TOKEN is ', token);
    if (!token) {
			return res.status(401).json({
				success: false,
				message: "Token is missing",
			});
    }
    
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded", decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
				success: false,
				message: "token is invalid",
				error: error,
			});
    }
    next();

  } catch (error) {
    console.log(error);
		return res.status(401).json({
			success: false,
			message: "Something went wrong while validating the token",
		});
  }
}


exports.checkAuthor = async (req, res, next) => {
  try {
    if (req.user.role !== 'author') {
      return res.status(401).json({
				success: false,
				message: "This is a protected route for Author only",
			});
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error,
			success: false,
			message: "User role cannot be verified, please try again",
		});
  }
}