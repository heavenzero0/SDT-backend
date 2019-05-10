const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.username, { min: 4, max: 30 })) {
    errors.username = "username must be 4 to 30 characters";
  }

  if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    errors.password = "password must be 4 to 30 characters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "username field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
