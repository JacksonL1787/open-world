const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const randomstring = require('randomstring');
const logs = require('./logs')
const colors = require('colors');
const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")

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
          password,
          profilePicture: "user.png",
          darkMode: false,
          rooms: ["test"],
          chqID: randomstring.generate({
            length: 4,
            charset: 'numeric'
          }),
          permission: "teacher",
          permissionLevel: "1",
          school: "TBD",
          position: "TBD",
          activeTFA: false,
          visibility: true,
          activity: {
            status: "offline",
            lastSeen: Date.now()
          },
          checks: {
            completedSecurityIntro: false,
            completedAccountSetup: false,
            accountSetupProgress: 0
          },
          TFA: {
            method: "Pending",
            metadata1: "Pending",
            metadata2: "Pending",
            lastChecked: Date.now()
          },
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
  passport.authenticate('local', function(err, user, info) {
		if (err) {
		  logs.failedLogin(req, res, next)
  		res.redirect('/')
		}
		if (!user) {
		  logs.blockedLogin(req, res, next)
		  res.redirect('/')
		}
		req.login(user, loginErr => {
		  if (loginErr) {
		    return next(loginErr);
		  }
		  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        var db = client.db('OpenWorld');
        assert.equal(null, err);
        function getArr() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('users').find({"email": req.user.email}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        
        async function run() {
            var arr1 = await getArr()
            var curuser = arr1[0]
            if(curuser.activeTFA) {
      		    res.redirect('/2FA')
      		  } else {
      		    logs.login(req, res, next)
      		    res.redirect('/dashboard')
      		  }
            
        }
        
        run();
    })
		});
	})(req, res, next);
});


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;