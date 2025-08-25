const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");

requestRouter.post("/sendRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Connection request sent from " + user.firstName);
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

module.exports = requestRouter;
