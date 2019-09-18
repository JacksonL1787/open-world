const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring')

const updateDB = require('./teacher/updateDB')

module.exports = {
	beginLockDown: (req, logID) => {
		MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
			if(err) throw err;
			var db = client.db('OpenWorld');
			let newVal = {
				$set: {
					active: true,
					startTime: Date.now(),
					logID: logID,
					liveChat: [],
					updates: []
				}
			}
			db.collection('currentLockdown').update({}, newVal)
			var io = req.app.get('socket.io');
			io.emit('lockdown-screen-redirect');
			console.log("begin")
			function getRoomData() {
				return new Promise(function(resolve, reject) {
					const data = db.collection('classrooms').find({"roomNumber": "127"}).toArray()
					data.then(function(result) {
						resolve(result[0])
					})
				})
			}
			async function executeCommands() {
				var room = await getRoomData()
				console.log(room.devices)
				updateDB.updateLightSwitch({room: "127", state: true})
				updateDB.updateDoorLock({room: "127", state: true})
				updateDB.updateBlinds({room: "127", state: "close"})
				io.emit('commands', 'doorLock')
				io.emit('commands', 'roomLightsOff')
				if(room.devices.blinds == "open") {
					io.emit('commands', 'blindsClose')
				}
			}
			executeCommands()
		})
	},
	endLockdown: (req) => {
		MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
			if(err) throw err;
			var db = client.db('OpenWorld');
			function getCurrentLockdownData() {
				return new Promise(function(resolve, reject) {
					const data = db.collection('currentLockdown').find({}).toArray()
					data.then(function(result) {
						resolve(result[0])
					})
				})
			}
			async function main() {
				let currentLockdownData = await getCurrentLockdownData()
				console.log(currentLockdownData)
				let logData = {
					$set: {
						'data.endTime': Date.now(),
						'data.liveChat': currentLockdownData.liveChat,
						'data.updates': currentLockdownData.updates
					}
				}
				db.collection('logs').update({'logID': currentLockdownData.logID}, logData)
				let resetLockdownData = {
					$set: {
						active: false,
						endTime: null,
						logID: null,
						startTime: null,
						liveChat: [],
						updates: []
					}
				}
				db.collection('currentLockdown').update({}, resetLockdownData)
				var io = req.app.get('socket.io');
				io.emit('teacher-dashboard-redirect');
			}
			main()
		})
	},
	addChat: (data) => {
		MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
			if(err) throw err;
			var db = client.db('OpenWorld');
			const msgData = data
			db.collection('currentLockdown').update({}, {$push: {liveChat: msgData}})
		})
	},
	addUpdate: (data) => {
		MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
			if(err) throw err;
			var db = client.db('OpenWorld');
			const updateData = data
			db.collection('currentLockdown').update({}, {$push: {updates: updateData}})
		})
	},
	endLockdownAuth: (req,res,next) => {
		if(req.user) {
			MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
				if(err) throw err;
				var db = client.db('OpenWorld');
				console.log(req.body)
				db.collection('users').find({'email': req.user.email}).toArray(function(err, data) {
					if(err) throw err;
					console.log(data[0])
					bcrypt.compare(req.body.password, data[0].password, function(err,result) {
						if(err) throw err;
						if(result){
							module.exports.endLockdown(req)
						} else {
							res.send({status: 'failure'})
						}
					})
				})
			})
		} else {
			res.send({status: 'failure'})
		}
	}
}