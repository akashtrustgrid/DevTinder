const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/userAuth");
var cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://3.106.202.90",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// For parsing application/json
app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/user"));

app.get("/feed", userAuth, async (req, res) => {
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
