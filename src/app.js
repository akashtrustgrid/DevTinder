const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpUser, validateLoginUser } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/userAuth");

const app = express();

// For parsing application/json
app.use(express.json());
app.use(cookieParser());

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
      throw new Error("Invalid credentials!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials!");
    }
    const token = await jwt.sign({ id: user._id }, "Akash@1991$007", {
      expiresIn: "1d",
    });
    console.log("token: ", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.send("login successfully!");
  } catch (err) {
    console.log(err.message);

    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/api/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

app.post("/api/sendRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Connection request sent from " + user.firstName);
  } catch (error) {
    res.status(401).send("ERROR : " + error.message);
  }
});

app.get("/api/feed", userAuth, async (req, res) => {
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
