var express = require('express');
var router = express.Router();

const routing = require("./indexRouter")
const logUpdate = require("./logs")
const lockdown = require('./lockdown')

/* GET home page. */
const { forwardAuthenticated } = require('../config/auth')
const { ensureAuthenticated } = require('../config/auth')

router.get('/', forwardAuthenticated, function(req, res, next) {
  res.redirect('/auth/login')
});

router.get('/dashboard', function(req, res, next) {
  routing.dashboardRouter(req, res, next)
});

router.post('/end-lockdown', function(req, res,next) {
  lockdown.endLockdownAuth(req,res,next)
})

module.exports = router;
