const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const bcrypt = require('bcryptjs');

module.exports = {
    updateProfilePicture: (req,res,next) => {
        if(req.user && req.user.permission == "teacher") {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                 db.collection('users').findOne({"email": req.user.email}, function(err, result) {
                    if(err) throw err;
                    if(result.profilePicture != "user.png") {
                        fs.unlink('public/uploads/' + result.profilePicture, function() {
                            console.log("success")
                        })
                    }
                })
                db.collection('users').updateOne({"email": req.user.email}, { $set: {"profilePicture": req.file.filename}})
                res.send(200)
            })
        }
    },
    updateUserData: (req,res,next) => {
        if(req.user && req.user.permission == "teacher") {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                console.log(req.user.email)
                db.collection('users').updateOne({"email": req.user.email}, { $set: {"firstName": req.body.firstName, "lastName": req.body.lastName, "email": req.body.email}})
                res.send(200)
            })
        }
    },
    updatePassword: (req,res,next) => {
        if(req.user && req.user.permission == "teacher") {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                var password;
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw err
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        console.log(password)
                        db.collection('users').updateOne({"email": req.user.email}, { $set: {"password": password}})
                        res.send(200)
                    });
                });
                
                
            })
        }
    },
    darkMode: (req,res,next) => {
        if(req.user && req.user.permission == "teacher") {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                console.log(req.body)
                db.collection('users').updateOne({"email": req.user.email}, { $set: {"darkMode": req.body.status}})
                res.send(200)
                
                
            })
        }
    },
    addStudentNote: (req,res,next) => {
        if(req.user && req.user.permission == "teacher") {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('students').updateOne({"studentID": parseInt(req.body.student)}, { $push: {notes: {"creator": req.body.creator, "date": req.body.date, "message": req.body.message, "noteID": req.body.noteID}}})
                res.send(200)
            })
        }
    },
    deleteStudentNote: (req,res,next) => {
        if(req.user && req.user.permission == "teacher") {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('students').update({"studentID": parseInt(req.body.student)}, { $pull: {notes: {noteID: req.body.noteID}}})
                res.send(200)
            })
        }
    },
    updateLightingColor: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.lightingColor": data.color}})
            })
    },
    updateLightBrightness: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.lightBrightness": data.value}})
            })
    },
    updateLightSwitch: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.lightSwitch": data.state}})
            })
    },
    updateProjector: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.projector": data.state}})
            })
    },
    updateDoorLock: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.doorLock": data.state}})
            })
    },
    updateSetTemp: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.setTemp": data.value}})
            })
    },
    updateCurrentClimate: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.currentTemp": data.value}})
            })
    },
    updateBlinds: (data) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                if(err) throw err
                var db = client.db('OpenWorld');
                db.collection('classrooms').update({'roomNumber': data.room}, {$set: {"devices.blinds": data.state}})
            })
    }
}