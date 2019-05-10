const express = require("express");
const mongoose = require("Mongoose");
const passport = require("passport");
const router = express.Router();

// Load validation
const validateProfileInput = require("../../../validation/profile");

// Load all model
const Profile = require("../../../models/Profile");
const User = require("../../../models/User");

// @route   GET api/profile/test
// @desc    TEst profile route
// @access  public
router.get("/test", (req, res) => res.json({ msg: `Profile works` }));

// @route   GET api/profile
// @desc    get current user profile
// @access  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["username"])
      .then(profile => {
        if (!profile) {
          errors.noProfile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        return res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create user profile
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // GET FIELDS
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.handle = req.user.username;
    if (req.body.firstName) profileFields.firstName = req.body.firstName;
    if (req.body.middleInitial)
      profileFields.middleInitial = req.body.middleInitial;
    if (req.body.lastName) profileFields.lastName = req.body.lastName;
    if (req.body.prefix) profileFields.prefix = req.body.prefix;
    if (req.body.suffix) profileFields.suffix = req.body.handle;
    if (req.body.jobTitle) profileFields.jobTitle = req.body.jobTitle;
    profileFields.address = {};
    if (req.body.address) profileFields.address.address = req.body.address;
    if (req.body.city) profileFields.address.city = req.body.city;
    if (req.body.state) profileFields.address.state = req.body.state;
    if (req.body.stateAbbv)
      profileFields.address.stateAbbv = req.body.stateAbbv;
    if (req.body.country) profileFields.address.country = req.body.country;
    if (req.body.postalCode)
      profileFields.address.postalCode = req.body.postalCode;
    profileFields.contact = {};
    if (req.body.phone) profileFields.contact.phone = req.body.phone;
    if (req.body.sms) profileFields.contact.sms = req.body.phone;
    if (req.body.email) profileFields.contact.email = req.body.email;
    if (req.body.website) profileFields.contact.website = req.body.website;

    // return res.json(profileFields);

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update Profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create Profile

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "that handle already exists";
            res.status(400).json(errors);
          }
        });

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

// @route   get api/profile/handle/:handle
// @desc    get profile by handle
// @access  public
router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["username"])
    .then(profile => {
      let errors = {};
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      return res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ noProfile: "There is no profile for this user" })
    );
});

// @route   get api/profile/users/:user_id
// @desc    get profile by user id
// @access  public
router.get("/users/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["username"])
    .then(profile => {
      let errors = {};
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      return res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ noProfile: "There is no profile for this user" })
    );
});

// @route   get api/profile/all
// @desc    get all profile
// @access  public
router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["username"])
    .then(profiles => {
      let errors = {};
      if (!profiles) {
        errors.profiles = "there is no profiles";
        return res.status(404).json({ errors });
      }

      return res.json(profiles);
    })
    .catch(err => res.status(404).json({ noProfile: "There are no profiles" }));
});

module.exports = router;
