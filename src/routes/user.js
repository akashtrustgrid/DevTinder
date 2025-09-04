const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "imageUrl",
  "aboutMe",
  "skills",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);

    res.json({ message: "Connection requests", data: connectionRequests });
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", SAFE_DATA);

    res.json({ message: "Connection requests", data: connectionRequests });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
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
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);
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

userRouter.get("/feed", userAuth, async (req, res) => {
  const page = req.query.page || 1;
  let limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  limit = limit > 20 ? 20 : limit;

  const loggedInUser = req.user;

  const connectionRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  });

  const notAllowedUsers = new Set();

  connectionRequests.forEach((conn) => {
    notAllowedUsers.add(conn.toUserId);
    notAllowedUsers.add(conn.fromUserId);
  });

  const users = await User.find({
    $and: [
      { _id: { $ne: loggedInUser._id } },
      { _id: { $nin: [...notAllowedUsers] } },
    ],
  })
    .select(SAFE_DATA)
    .skip(skip)
    .limit(limit);
  res.json({ message: "Feeds", data: users });
});

module.exports = userRouter;
