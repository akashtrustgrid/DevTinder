const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUser = req.user;
      const { status, toUserId } = req.params;
      const toUser = await User.findById(toUserId).exec();
      if (!toUser) {
        throw new Error("User not found");
      }

      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid " + status + " status");
      }

      const connection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUser._id, toUserId },
          { fromUserId: toUserId, toUserId: fromUser._id },
        ],
      });

      if (connection) {
        throw new Error("You are already connected with " + toUser.firstName);
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUser._id,
        toUserId: toUser._id,
        status: status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          fromUser.firstName +
          " " +
          status +
          " " +
          (status === "intrested" ? "in " : "to ") +
          toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).json("ERROR : " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid " + status + " status!");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found!");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request " + status + "!",
        data,
      });
    } catch (error) {
      res.status(400).json("ERROR : " + error.message);
    }
  }
);

module.exports = requestRouter;
