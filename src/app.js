const express = require("express");
const connectDB = require("./config/database");
const { userAuth } = require("./middleware/auth");

const app = express();

connectDB()
  .then(() => {
    console.log("Database connected!");
    app.listen(3000, () => {
      console.log("server is started on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database error:", err);
  });
