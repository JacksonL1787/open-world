const colors = require('colors');
const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const render = require("./render")
const passport = require('passport');
const logs = require('../logs')
const updateDB = require("./updateDB")
const randomstring = require('randomstring')
const lockdown = require('../lockdown')

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// 
// Checks
// 

// DB Update Midnight
const schedule = require('node-schedule')

schedule.scheduleJob('0 0 * * *', () => {
	MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        var db = client.db('OpenWorld');
        assert.equal(null, err);
        function getArr() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('graphs').find({}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        async function run() {
            var graphs = await getArr()
            for(var i = 0; i < graphs.length; i++) {
            	var data = []
            	data = graphs[i].data
            	data.shift()
            	data.push({"label": Date.now(), "data": graphs[i].currentData})
            	db.collection('graphs').updateOne({'graph': graphs[i].graph}, { $set: {data}})
            }
        }
        
        run();
    })
})
schedule.scheduleJob('0 12 * * *', () => {
	MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        var db = client.db('OpenWorld');
        assert.equal(null, err);
        function getArr() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('graphs').find({}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        async function run() {
            var graphs = await getArr()
            for(var i = 0; i < graphs.length; i++) {
            	var data = []
            	data = graphs[i].data
            	data.shift()
            	data.push({"label": Date.now(), "data": graphs[i].currentData})
            	db.collection('graphs').updateOne({'graph': graphs[i].graph}, { $set: {data}})
            }
        }
        
        run();
    })
})


// 
// Routers
// 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  render.index(req, res, next)
});

router.get('/school/controls', function(req, res, next) {
  render.schoolControls(req, res, next)
});

router.get('/school/accounts', function(req, res, next) {
  render.schoolAccounts(req, res, next)
});

router.post('/update/logs', function(req, res, next) {
	logs.upLOGS(req, res, next)	
})

router.get('/security', function(req, res, next) {
  render.securityLander(req, res, next)
});

router.get('/security/center', function(req, res, next){
	render.securityCenter(req, res, next)
})

router.get('/school/accounts/builder/student', function(req, res, next) {
  render.studentBuilder(req, res, next)
})


router.post('/school/accounts/builder/student/post', function (req, res, next) {
	updateDB.insertStudent(req, res, next)
})

router.post('/status/set', function (req, res, next) {
	updateDB.statusin(req, res, next)
})

router.post('/security/check/password', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
		  res.sendStatus(500)
		}
		if (! user) {
		  res.sendStatus(403)
		}
		req.login(user, loginErr => {
		  if (loginErr) {
		    return next(loginErr);
		  }
		  res.sendStatus(200)
		});
	})(req, res, next);
})

router.post('/update/sec/logs', function(req, res, next) {
    logs.securitylogs(req, res, next)
})

// ALERTS

router.post('/security/triggers/twilio/event', function(req, res, next) {
	console.log(' INCOMING '.bgGreen.bold + " a Lockdown has been requested from a mobile location, Running Checks");	
	MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        var db = client.db('OpenWorld');
        assert.equal(null, err);
        function getArr() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('users').find({}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        function getArr2() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('schools').find({}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        async function runSys() {
            var arr1 = await getArr()
            var arr2 = await getArr2()
            var schoolID = req.body.SchoolID.replace(/\s/g, '');
            var userID = req.body.userID.replace(/\s/g, '');
            var alertDESC = req.body.alert
            if(req.body.alert.includes("lockdown") || req.body.alert.includes("Lockdown")) {
            	alertDESC = "Lockdown"
            }
            console.log(req.body)
            for(var i = 0; i < arr2.length; i++){
            	console.log(' LOOKING FOR SCHOOL '.bgCyan.bold);
            	if(arr2[i].schoolID == schoolID) {
            		console.log(' FOUND SCHOOL '.bgBlue.bold);
            		for(var b = 0; b < arr1.length; b++) {
    					console.log(' LOOKING FOR USER OF TRIGGER '.bgCyan.bold);
            			if(arr1[b].chqID == userID) {
            				// 
            				console.log('                            '.bgRed.bold);
            				console.log('                            '.bgRed.bold);
							console.log('   REMOTE ALERT TRIGGERED   '.bgRed.bold);
							console.log('                            '.bgRed.bold);
							console.log('                            '.bgRed.bold);
							var time = Date.now()
							var id = randomstring.generate({length: 12, charset: 'numeric'})
							var type = capitalize(alertDESC)
							var desc;
							if(type == "Lockdown") {
								lockdown.beginLockDown(req,id)
								var io = req.app.get('socket.io');
     							io.emit(type, {"id": id});
								desc = "A Lockdown has been triggered within the building. A schoolwide lockdown event has occured."
								db.collection('logs').insert({ "logID": id,"pushUser": {"_id": arr1[b]._id,}, "data": { type, time, "description": desc }, "logType": "Security", "actionTaken": false })
							}
							
							
							res.sendStatus(200);	
            			}
            		}
            	}
            }
        }
        
        runSys();
    })
})


module.exports = router;
