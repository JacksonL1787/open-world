const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const bcrypt = require('bcryptjs');

module.exports = {
    manageStudents: (req,res,next) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
            if(err) throw err
            var db = client.db('OpenWorld');
            
            function getStudents() {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('students').find({}).toArray()
                    data.then(function(result) {
                        resolve(result)
                    })
                })
            }
            
            async function render() {
                var students = await getStudents()
                res.render('teacher/dashboard', { title: 'Manage Students', user: req.user, students: JSON.stringify(students) });
            }
            render()
        })
    },
    classroomControls: (req,res,next) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
            if(err) throw err
            var db = client.db('OpenWorld');
            function getClassrooms() {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('classrooms').find({}).toArray()
                    data.then(function(result) {
                        resolve(result)
                    })
                })
            }
            
            async function render() {
                var allClassrooms = await getClassrooms()
                let classrooms = [];
                for(var i=0;i<allClassrooms.length;i++) {
                    for(var j=0;j<req.user.rooms.length;j++) {
                        if(allClassrooms[i].roomNumber == req.user.rooms[j]) {
                            classrooms.push(allClassrooms[i])
                        }
                    }
                    
                }
                res.render('teacher/dashboard', { title: 'Classroom Controls', user: req.user, classrooms: JSON.stringify(classrooms) });
            }
            render()
        })
    },
    studentPage: (req,res,next) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
            if(err) throw err
            var db = client.db('OpenWorld');
            function getStudent() {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('students').find({"studentID": parseInt(req.params.id)}).toArray()
                    data.then(function(result) {
                        resolve(result[0])
                    })
                })
            }
            
            async function render() {
                var student = await getStudent()
                res.render('teacher/dashboard', { title: student.firstName + " " + student.lastName, user: req.user, student: JSON.stringify(student) });
            }
            render()
        })
    },
    security: (req,res,next) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
            if(err) throw err
            var db = client.db('OpenWorld');
            function getEmergencies() {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('logs').find().toArray()
                    data.then(function(result) {
                        let emergencies = [];
                        for(var i = 0; i < result.length; i++) {
                            if(result[i].logType == "Security") {
                                emergencies.push(result[i])
                            }
                        }
                        resolve(emergencies)
                    })
                })
            }
            
            function getUserData(id) {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('users').find({"_id": id}).toArray()
                    data.then(function(result) {
                        resolve(result[0])
                    })
                })
            }
            
            async function render() {
                var emergencies = await getEmergencies()
                for(var i = 0; i < emergencies.length; i++) {
                    var userData = await getUserData(emergencies[i].pushUser._id)
                    if(userData) {
                        emergencies[i].pushUser = {firstName: userData.firstName, lastName: userData.lastName}
                    } else {
                        emergencies[i].pushUser = {firstName: 'Unknown', lastName: 'Unknown'}
                    }
                }
                res.render('teacher/dashboard', { title: 'Security', user: req.user, emergencies: JSON.stringify(emergencies)});
            }
            render()
        })
    },
    lockdown: (req,res,next) => {
        MongoClient.connect("mongodb://localhost:27017", function(err, client) {
            if(err) throw err
            var db = client.db('OpenWorld');
            function getCurrentLockdown() {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('currentLockdown').find({}).toArray()
                    data.then(function(result) {
                        resolve(result[0])
                    })
                })
            }
            
            async function render() {
                var currentLockdown = await getCurrentLockdown()
                res.render('teacher/lockdown', { user: req.user, currentLockdown: JSON.stringify(currentLockdown)});
            }
            render()
        })
    }
}