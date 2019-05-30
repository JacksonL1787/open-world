var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  if(req.user) {
    res.render('admin/dashboard', { user: req.user, title: 'Admin Dashboard' });
  } else {
    res.redirect('/')
  }
});

router.get('/school/controls', function(req, res, next) {
  if(req.user) {
    res.render('admin/schoolControls', { user: req.user, title: 'Admin Dashboard' });
  } else {
    res.redirect('/')
  }
});

router.get('/school/accounts', function(req, res, next) {
  if(req.user) {
    res.render('admin/accounts', { user: req.user, title: 'Admin Dashboard' });
  } else {
    res.redirect('/')
  }
});

module.exports = router;
