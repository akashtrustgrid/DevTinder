const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequests");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({ message: "Connection requests", data: connectionRequests });
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    const data = connectionRequests.map((conn) => {
      if (conn.fromUserId.equals(loggedInUser._id)) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    res.json({ message: "Connection requests", data });
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
