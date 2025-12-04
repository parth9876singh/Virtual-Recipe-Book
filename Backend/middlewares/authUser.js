const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    // Support token from cookies or Authorization: Bearer <token>
    let token = req.cookies.token;

    if (!token) {
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied." });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decode._id);

    if (!user) {
      return res.status(401).json({ message: "Access denied." });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

