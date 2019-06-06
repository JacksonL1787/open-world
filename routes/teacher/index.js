const express = require('express');
const router = express.Router();

const auth = require('../../config/auth')
const updateDB = require('./updateDB')
const render = require('./render')

const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
})

const upload = multer({ storage: storage })


/*
  GET FUNCTIONS
*/

router.get('/home', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Home', user: req.user });
});

router.get('/pa-system', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'PA System', user: req.user });
});

router.get('/manage-students', auth.teacherAuth, function(req, res, next) {
  render.manageStudents(req,res,next)
});

router.get('/classroom-controls', auth.teacherAuth, function(req, res, next) {
  render.classroomControls(req,res,next)
});

router.get('/settings', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Settings', user: req.user});
});



/*
  POST FUNCTIONS
*/

router.post('/update/profile-picture', upload.single('file'), function(req, res, next) {
  updateDB.updateProfilePicture(req,res,next)
});

router.post('/update/user-data', function(req, res, next) {
  updateDB.updateUserData(req,res,next)
});

router.post('/update/password', function(req, res, next) {
  updateDB.updatePassword(req,res,next)
});

router.post('/dark-mode', function(req, res, next) {
  updateDB.darkMode(req,res,next)
});

module.exports = router;
