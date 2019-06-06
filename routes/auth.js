const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/Users');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res, next) => res.render('index'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res, next) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          profilePicture: "user.png",
          darkMode: false,
          rooms: ["test"],
          permission: "teacher",
          permissionLevel: "1",
          school: "TBD",
          position: "TBD",
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          if(err) throw err
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;