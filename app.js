const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require("connect-flash");

const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const session = require('express-session');

const bodyParser = require('body-parser');

const passport = require('passport');

const teacherRouter = require('./routes/teacher/index');
const adminRouter = require('./routes/admin/index');
const indexRouter = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

const port = 4010
var server = app.listen(port, () => console.log('Server started listening on port '+ port + "!"));

require('./passport/passport')(passport)

mongoose.connect('mongodb://localhost:27017/OpenWorld')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'jacksonSucks',
                  resave: false, 
                  saveUninitialized: false}));

app.use('/', indexRouter);
app.use('/teacher', teacherRouter);
app.use('/admin', adminRouter);
app.use('/auth', auth)

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


var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	socket.on('test', function(msg) {
		socket.broadcast.emit('commands', 'longBeep')
	})
	socket.on('projectorOn', function(msg) {
		socket.broadcast.emit('commands', 'on')
	})
	socket.on('projectorOff', function(msg) {
		socket.broadcast.emit('commands', 'off')
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
});

module.exports = app;






