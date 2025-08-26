const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const { validateUserProfile } = require("../utils/validation");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
  try {
    validateUserProfile(req);
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
