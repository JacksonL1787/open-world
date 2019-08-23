const express = require('express');
const router = express.Router();
const randomstring = require('randomstring')
const MongoClient = require('mongodb').MongoClient;

const auth = require('../../config/auth')
const updateDB = require('./updateDB')
const render = require('./render')

const multer  = require('multer');

const lockdown = require('../lockdown')


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

router.get('/', auth.teacherAuth, function(req, res, next) {
	res.redirect('/teacher/home')
});

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

router.get('/security', auth.teacherAuth, function(req, res, next) {
	render.security(req,res,next)
});

router.get('/student/:id', auth.teacherAuth, function(req, res, next) {
	render.studentPage(req,res,next)
});

router.get('/lockdown', auth.lockdownAuth, function(req, res, next) {
	render.lockdown(req,res,next)
})



/*
	POST FUNCTIONS
*/

router.post('/begin-lockdown', upload.single('file'), function(req, res, next) {
	MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
		var db = client.db('OpenWorld');
		if(err) throw err;
		var time = Date.now()
		var id = randomstring.generate({length: 12, charset: 'numeric'})
		var type = "Lockdown"
		var desc = req.body.additionalInfo || "A Lockdown has been triggered within the building. A schoolwide lockdown event has occured."
		lockdown.beginLockDown(req,id)
		var io = req.app.get('socket.io');
		io.emit(type, {"id": id});
		db.collection('logs').insert({ "logID": id,"pushUser": {"_id": req.user._id,}, "data": { type, time, "description": desc }, "logType": "Security", "actionTaken": false })
	})
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

router.post('/dark-mode', function(req, res, next) {
	updateDB.darkMode(req,res,next)
});

router.post('/student/add-note', function(req, res, next) {
	updateDB.addStudentNote(req,res,next)
});

router.post('/student/delete-note', function(req, res, next) {
	updateDB.deleteStudentNote(req,res,next)
});

module.exports = router;
