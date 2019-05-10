const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  // data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.middleInitial = !isEmpty(data.middleInitial) ? data.middleInitial : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.stateAbbv = !isEmpty(data.stateAbbv) ? data.stateAbbv : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  // if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
  //   errors.handle = "handle must be 2 to 30 characters";
  // }

  if (!Validator.isEmail(data.email)) {
    errors.email = "invalid email format";
  }

  // if (Validator.isEmpty(data.handle)) {
  //   errors.handle = "handle field is required";
  // }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "lastname field is required";
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "firstname field is required";
  }

  if (Validator.isEmpty(data.middleInitial)) {
    errors.middleInitial = "middle initial field is required";
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = "address field is required";
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = "city field is required";
  }

  if (Validator.isEmpty(data.state)) {
    errors.state = "state field is required";
  }

  if (Validator.isEmpty(data.stateAbbv)) {
    errors.stateAbbv = "state abbv field is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "country field is required";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "phone field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
