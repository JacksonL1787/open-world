

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require("connect-flash");
const app = express();
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const session = require('express-session');

const port = 4010
var server = app.listen(port, () => console.log('Server started listening on port '+ port + "!"));

const bodyParser = require('body-parser');

const passport = require('passport');
var io = require('socket.io').listen(server);

const teacherRouter = require('./routes/teacher/index');
const adminRouter = require('./routes/admin/index');
const indexRouter = require('./routes/index');
const TFARouter = require('./routes/2FA/2FA')
const nodeRed = require("./routes/nodered/index")
const auth = require('./routes/auth');
const teacherUpdateDB = require('./routes/teacher/updateDB')
const lockdown = require('./routes/lockdown')

require('./passport/passport')(passport)

mongoose.connect('mongodb://localhost:27017/OpenWorld', { useNewUrlParser: true })


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('socket.io', io);

app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.svg')))

app.use(flash());
app.use(session({ secret: 'anything', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(session({cookie: { maxAge: 60000 }, 
//                   secret: 'jacksonSucks',
//                   resave: false, 
//                   saveUninitialized: false}));

app.use('/', indexRouter);
app.use('/teacher', teacherRouter);
app.use('/admin', adminRouter);
app.use('/auth', auth)
app.use('/2FA', TFARouter)
app.use('/node-red', nodeRed)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function(socket){
	socket.on('ringBell', function(msg) {
		socket.broadcast.emit('commands', 'longBeep')
	})
	socket.on('activityAlert', function(msg) {
		console.log(msg)
	    socket.emit('activityAlert', msg)
	})
	socket.on('projectorOn', function(msg) {
		socket.broadcast.emit('commands', 'projectorOn')
	})
	socket.on('projectorOff', function(msg) {
		socket.broadcast.emit('commands', 'projectorOff')
	})
	socket.on('doorLock', function(msg) {
		socket.broadcast.emit('commands', 'doorLock')
	})
	socket.on('doorUnlock', function(msg) {
		socket.broadcast.emit('commands', 'doorUnlock')
	})
	socket.on('blindsOpen', function(msg) {
		socket.broadcast.emit('commands', 'fanOn')
	})
	socket.on('blindsClose', function(msg) {
		socket.broadcast.emit('commands', 'fanOff')
	})
	socket.on('lightingColor', function(msg) {
		socket.broadcast.emit('commands', msg)
	})
	socket.on('lightsOff', function(msg) {
		socket.broadcast.emit('commands', 'roomLightsOff')
	})
	socket.on('lightsOn', function(msg) {
		socket.broadcast.emit('commands', 'roomLightsOn')
	})
	socket.on('lightsBrightness', function(msg) {
		socket.broadcast.emit('commands', msg)
	})
	socket.on('tts', function(msg) {
		socket.broadcast.emit('text-speech', msg)
	})
	socket.on('lockdown', function(msg) {
		socket.broadcast.emit('lockdown', msg)
	})
	socket.on('emergency', function(msg) {
		socket.broadcast.emit('emergency', msg)
	})
	socket.on('lightingColorUpdateDB', function(msg) {
		teacherUpdateDB.updateLightingColor(msg)
	})
	socket.on('lightBrightnessUpdateDB', function(msg) {
		teacherUpdateDB.updateLightBrightness(msg)
	})
	socket.on('lightSwitchUpdateDB', function(msg) {
		teacherUpdateDB.updateLightSwitch(msg)
	})
	socket.on('doorLockUpdateDB', function(msg) {
		teacherUpdateDB.updateDoorLock(msg)
	})
	socket.on('projectorUpdateDB', function(msg) {
		teacherUpdateDB.updateProjector(msg)
	})
	socket.on('setTempUpdateDB', function(msg) {
		teacherUpdateDB.updateSetTemp(msg)
	})
	socket.on('lockdown-msg', function(msg) {
		if(msg.message.replace(/ /g, "").length != 0) {
			if(msg.message.toLowerCase().startsWith('!update')) {
				msg.message = msg.message.slice(8)
				socket.emit('updated-added-confirm')
				io.emit('add-lockdown-update', msg)
				lockdown.addUpdate(msg)
			} else {
				io.emit('add-lockdown-msg', msg)
				lockdown.addChat(msg)
			}
			
		}
	})
});

module.exports = app;






