const validator = require("validator");

const validateSignUpUser = (req) => {
  if (!req.body) {
    throw new Error("Body is required");
  }
  const { firstName, emailId, password, lastName } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  }
  if (
    !validator.isAlphanumeric(firstName) ||
    !validator.isAlphanumeric(lastName)
  ) {
    throw new Error("Name should be alphanumeric");
  }
  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Email Id is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain alphanumeric, capital letters and special characters"
    );
  }
};

const validateLoginUser = (req) => {
  if (!req.body) {
    throw new Error("Body is required");
  }
  const { emailId, password } = req.body;
  if (!emailId) {
    throw new Error("Email Id is required");
  }
  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Email Id is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain alphanumeric, capital letters and special characters"
    );
  }
};

module.exports = { validateSignUpUser, validateLoginUser };
