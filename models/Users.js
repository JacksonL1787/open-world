const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    required: true
  },
  permissionLevel: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  profilePicture: {
    type: String,
    required: true
  },
  darkMode: {
    type: Boolean,
    required: true
  },
  rooms: {
    type: Array,
    required: false
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;