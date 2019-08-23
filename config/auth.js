const MongoClient = require('mongodb').MongoClient;

module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		// req.flash('error_msg', 'Please log in to view that resource');
		res.redirect('/');
	},
	forwardAuthenticated: function(req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/dashboard');      
	},
	teacherAuth: function(req,res,next) {
		if(req.user) {
			MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
				if(err) throw err;
				var db = client.db('OpenWorld');
				db.collection('currentLockdown').find({}).toArray(function(err,result) {
					if(err) throw err;
					if(result[0].active) {
						res.redirect('/teacher/lockdown')
					} else {
						if(req.user.permission == "teacher") {
							next()
						} else if(req.user.permission == "admin") {
							res.redirect('/dashboard')
						} else {
							res.redirect('/auth/logout')
						}
					}
				})
			})
		} else {
			res.redirect('/auth/login')
		}
	},
	lockdownAuth: function(req,res,next) {
		if(req.user) {
			MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
				if(err) throw err;
				var db = client.db('OpenWorld');
				db.collection('currentLockdown').find({}).toArray(function(err,result) {
					if(err) throw err;
					if(result[0].active) {
						next()
					} else {
						if(req.user.permission == "teacher") {
							res.redirect('/teacher')
						} else if(req.user.permission == "admin") {
							res.redirect('/dashboard')
						} else {
							res.redirect('/auth/logout')
						}
					}
				})
			})
		} else {
			res.redirect('/auth/login')
		}
	}
};