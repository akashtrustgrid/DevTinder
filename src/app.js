const express = require("express");
const { userAuth } = require("./utils/middleware");

const app = express();

app.use("/user", userAuth, (req, res) => {
  res.send("You can access Dashboard!");
});

app.listen(3000, () => {
  console.log("server is started on port 3000...");
});
