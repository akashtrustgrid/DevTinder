const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateSignUpUser,
  validateLoginUser,
} = require("../utils/validation");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpUser(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: firstName.trim().toLowerCase(),
      lastName: lastName.trim().toLowerCase(),
      emailId: emailId.trim().toLowerCase(),
      password: passwordHash,
    });

    await user.save();
    res.send("signup successfully!");
  } catch (err) {
    console.log(err.message);

    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    validateLoginUser(req);
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId }).exec();
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials!");
    }
    const token = jwt.sign({ id: user._id }, "Akash@1991$007", {
      expiresIn: "1d",
    });
    console.log("token: ", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.send("login successfully!");
  } catch (err) {
    console.log(err.message);

    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("logout successfully!");
});

module.exports = authRouter;
