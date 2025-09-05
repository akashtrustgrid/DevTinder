const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(process.env.DATABASE_URL);
};

module.exports = connectDB;
