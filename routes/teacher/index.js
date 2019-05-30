const express = require('express');
const router = express.Router();

const auth = require('../../config/auth')
const updateDB = require('./updateDB')

const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
})

let upload = multer({ storage: storage })

/* GET home page. */
router.get('/home', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Home', user: req.user });
});

router.get('/attendance', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Attendance', user: req.user });
});

router.get('/pa-system', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'PA System', user: req.user });
});

router.get('/manage-students', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Manage Students', user: req.user });
});

router.get('/classroom-controls', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Classroom Controls', user: req.user });
});

router.get('/settings', auth.teacherAuth, function(req, res, next) {
  res.render('teacher/dashboard', { title: 'Settings', user: req.user});
});

router.post('/update/profile-picture', upload.single('file'), function(req, res, next) {
  updateDB.updateProfilePicture(req,res,next)
});

router.post('/update/user-data', function(req, res, next) {
  updateDB.updateUserData(req,res,next)
});

router.post('/update/password', function(req, res, next) {
  updateDB.updatePassword(req,res,next)
});

module.exports = router;
