const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://SocialDB:APg4sofKuJlNVpMw@socialdb.fsr6qnu.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
