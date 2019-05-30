var express = require('express');
var router = express.Router();

var routing = require("./indexRouter")

/* GET home page. */
const { forwardAuthenticated } = require('../config/auth')
const { ensureAuthenticated } = require('../config/auth')

router.get('/', forwardAuthenticated, function(req, res, next) {
  res.redirect('/auth/login')
});

router.get('/dashboard', function(req, res, next) {
  routing.dashboardRouter(req, res, next)
  console.log(req.user)
});

router.post('/login', function(req, res, next) {
  
})

module.exports = router;
