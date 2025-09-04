const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageUrl: { type: String },
    skills: { type: [String] },
    aboutMe: { type: String },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
