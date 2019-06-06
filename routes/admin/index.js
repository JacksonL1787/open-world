var express = require('express');
var router = express.Router();

var render = require("./render")
var updateDB = require("./updateDB")
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
  render.schoolControls(req, res, next)
});

router.get('/school/accounts', function(req, res, next) {
  render.schoolAccounts(req, res, next)
});

router.get('/school/accounts/builder/student', function(req, res, next) {
  render.studentBuilder(req, res, next)
})


router.post('/school/accounts/builder/student/post', function (req, res, next) {
	updateDB.insertStudent(req, res, next)
})

module.exports = router;
