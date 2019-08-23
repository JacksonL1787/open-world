const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const fs = require('fs')
var io = require('socket.io')

module.exports = {
    insertStudent: (req, res, next) => {
        if(req.user){
            if(req.user.permission == "admin") {
                MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                    assert.equal(null, err);
                    var db = client.db('OpenWorld');
                    var advisorFirst = "Pending"
                    var advisorLast = "Pending"
                    var advisorEmail = "Pending"
                    db.collection('students').insert({"firstName": req.body.firstName, "lastName": req.body.lastName, "grade": req.body.grade, "email": req.body.email, "studentID": Number(req.body.ID), advisor: {"firstName": advisorFirst, "lastName": advisorLast, "email": advisorEmail}, classes: req.body.classes})
                    res.send(200)
                })       
            } else {
                res.redirect('/dashboard')
            }
        } else {
            res.redirect('/')
            req.flash('You Need To Login First')
        }
    },
    statusin: (req, res, next) => {
        if(req.user){
            if(req.user.permission == "admin") {
                MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                    console.log(req.body)
                    assert.equal(null, err);
                    var db = client.db('OpenWorld');
                    db.collection('users').updateOne({"email": req.user.email}, { $set: {"activity": {"status": req.body.phase, "lastSeen": Date.now()}}})
                    res.send(200)
                })       
            } else {
                res.redirect('/dashboard')
            }
        } else {
            res.redirect('/')
            req.flash('You Need To Login First')
        }
    },
}