const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpUser, validateLoginUser } = require("./utils/validation");

const app = express();

// For parsing application/json
app.use(express.json());

app.post("/api/signup", async (req, res) => {
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

app.get("/api/login", async (req, res) => {
  try {
    validateLoginUser(req);
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId }).exec();
    if (!user) {
      throw new Error("User not found!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Password is incorrect!");
    }
    res.send("login successfully!");
  } catch (err) {
    console.log(err.message);

    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/api/getAllUsers", async (req, res) => {
  const users = await User.find({}).exec();
  console.log("users: ", users);
  res.send(users);
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
