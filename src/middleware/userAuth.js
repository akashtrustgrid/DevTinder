const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("User is not authorized!");
    }
    const data = jwt.verify(token, "Akash@1991$007");
    const user = await User.findById(data.id);

    if (!user) {
      throw new Error("User is not authorized!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
};

module.exports = { userAuth };
