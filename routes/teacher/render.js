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
            console.log(req.user.rooms)
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
                console.log(allClassrooms)
                console.log(req.user)
                console.log(req.user.rooms)
                let classrooms = [];
                for(var i=0;i<allClassrooms.length;i++) {
                    for(var j=0;j<req.user.rooms.length;j++) {
                        if(allClassrooms[i].room == req.user.rooms[j]) {
                            classrooms.push(allClassrooms[i])
                        }
                    }
                    
                }
                res.render('teacher/dashboard', { title: 'Classroom Controls', user: req.user, classrooms: JSON.stringify(classrooms) });
            }
            render()
        })
    }
}