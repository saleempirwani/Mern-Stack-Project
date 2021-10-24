const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new Error("Unauthorized access");

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) throw new Error("Unauthorized access");

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) throw new Error("Unauthorized access");
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = { auth, isAdmin };
