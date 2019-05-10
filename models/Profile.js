const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleInitial: {
    type: String,
    required: true
  },
  prefix: {
    type: String
  },
  suffix: {
    type: String
  },
  jobTitle: {
    type: String
  },
  address: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    stateAbbv: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: String
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    sms: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    website: {
      type: String
    }
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
