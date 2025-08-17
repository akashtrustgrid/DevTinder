const userAuth = (req, res) => {
  const token = "xyz1";
  const isAuth = token === "xyz";
  if (isAuth) {
    req.next();
  } else {
    res.status(401).send("User is not authorized!");
  }
};

module.exports = { userAuth };
