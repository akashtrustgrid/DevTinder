const express = require("express");

const app = express();

// app.use("/test", (rH1,rH2, [rH3, rH4], rH5))

app.use(
  "/test",
  (req, res, next) => {
    req.next();
    //   res.send("Hello from server 1!");
  },
  (req, res, next) => {
    // res.send("Hello from server 2!");
    req.next();
  },
  (req, res, next) => {
    // res.send("Hello from server 3!");
    req.next();
  },
  (req, res, next) => {
    // res.send("Hello from server 4!");
    req.next();
  },
  (req, res, next) => {
    res.send("Hello from server 5!");
  }
);

app.listen(3000, () => {
  console.log("server is started on port 3000...");
});
