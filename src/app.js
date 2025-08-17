const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// For parsing application/json
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const userObj = req.body;
  console.log("body: ", userObj);
  const user = new User(userObj);
  try {
    await user.save();
    res.send("signup successfully!");
  } catch (err) {
    res.statusCode(400).send("something when wrong: ", err.message);
  }
});

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
