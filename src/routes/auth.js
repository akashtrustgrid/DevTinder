const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {
  validateSignUpUser,
  validateLoginUser,
  validateForgotPassword,
} = require("../utils/validation");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/userAuth");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpUser(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: emailId.trim().toLowerCase(),
      password: passwordHash,
    });

    const currentUser = await user.save();

    const token = jwt.sign({ id: user._id }, "Akash@1991$007", {
      expiresIn: "1d",
    });
    console.log("token: ", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({ message: "signup successfully!", data: currentUser });
  } catch (err) {
    console.log(err.message);

    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
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
    res.json({ message: "login successfully!", data: user });
  } catch (err) {
    console.log(err.message);
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("logout successfully!");
});

authRouter.post("/forgotPassword", userAuth, async (req, res) => {
  try {
    await validateForgotPassword(req);
    const user = req.user;
    const { currentPassword, password } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Your current password is not correct!");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password must contain alphanumeric, capital letters and special characters"
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();

    const token = jwt.sign({ id: user._id }, "Akash@1991$007", {
      expiresIn: "1d",
    });
    console.log("token: ", token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.send("Password reset successfully!");
  } catch (err) {
    console.log(err.message);
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = authRouter;
