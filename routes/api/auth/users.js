const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../../config/keys");

// load input validation
const validateLoginInput = require("../../../validation/login");
const validateRegisterInput = require("../../../validation/registration");

// Load user model
const User = require("../../../models/User");

// @route   GET api/users/test
// @desc    TEst users route
// @access  public
router.get("/test", (req, res) => res.json({ msg: `User works` }));

// @route   GET api/users/register
// @desc    Register User
// @access  public
router.post("/register", (req, res) => {
  let { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      errors.username = "username already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user | returning the token
// @access  public
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //find user by email
  User.findOne({ username }).then(user => {
    if (!user) {
      errors.username = "user not found";
      return res.status(404).json(errors);
    }
    // check password match
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User match
        const payload = { id: user.id, username: user.username }; // create JWT payload

        // sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 86400 },
          (err, token) => {
            return res.json({
              success: true,
              token: `Bearer ${token}`,
              expiresIn: 86400
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    return current users
// @access  private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;
