const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const fs = require('fs')
const randomstring = require('randomstring')

module.exports = {
    login: (req, res, next) => {
        if(req.user) {
            MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
                assert.equal(null, err);
                var db = client.db('OpenWorld');
                
                // 
                // DATA POINTS
                // 
                var type = "login"
                var time = Date.now()
                var description = "User has logged into their account"
                var logType = "account"
                var logID = randomstring.generate({length: 12, charset: 'numeric'})
                // 
                // 
                // 
                
                db.collection('logs').insert(
                    { 
                        "pushUser": {
                            "_id": req.user._id
                        },
                        "data": {
                            type,
                            time,
                            description
                        },
                        logType,
                        logID
                        
                    }
                )
            })
        } else {
            res.redirect('/')
            req.flash('You Need To Login First')
        }
    },
    upLOGS: (req, res, next) => {
        if(req.user) {
            MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
                assert.equal(null, err);
                var db = client.db('OpenWorld');
                var time = Date.now()
                var description = "User is taking action on lockdown"
                var logType = "Security"
                var logID = randomstring.generate({length: 12, charset: 'numeric'})
                // 
                // 
                // 
                console.log(req.body)
                db.collection('logs').insert(
                    { 
                        "pushUser": {
                            "_id": req.user._id
                        },
                        "data": {
                            "type": "Action",
                            time,
                            description
                        },
                        logID,
                        logType
                        
                    }
                )
                db.collection('logs').updateOne({"sendID": req.body.lockdownID}, { $set: {"actionTaken": true}})
            })
        } else {
            res.redirect('/')
            req.flash('You Need To Login First')
        }
    },
    login: (req, res, next) => {
        if(req.user) {
            console.log('logging login')
            MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
                assert.equal(null, err);
                var db = client.db('OpenWorld');
                var time = Date.now()
                var description = req.user.firstName + " " + req.user.lastName + " Has logged into their account"
                var logType = "Accounts"
                var type = "login"
                var logID = randomstring.generate({length: 12, charset: 'numeric'})
                // 
                // 
                // 
                db.collection('logs').insertOne(
                    { 
                        "pushUser": {
                            "_id": req.user._id
                        },
                        "data": {
                            type,
                            time,
                            description
                        },
                        logID,
                        logType
                        
                    }
                )
                
            })
        } else {
            res.redirect('/')
            console.log('unable to log login')
            req.flash('You Need To Login First')
        }
    },
    securitylogs: (req, res, next) => {
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            var db = client.db('OpenWorld');
            var time = Date.now()
                var description = "User is taking action on a Lockdown"
                var logType = "Security"
                var logID = randomstring.generate({length: 12, charset: 'numeric'})
                // 
                // 
                // 
                console.log(req.body)
                db.collection('logs').insert(
                    { 
                        "pushUser": {
                            "_id": req.user._id
                        },
                        "data": {
                            "type": "Action",
                            time,
                            description
                        },
                        logID,
                        logType
                        
                    }
                )
            // 
            // console.log(req.body.id)
            // 
            // 
            db.collection('logs').updateOne({'logID': req.body.id}, { $set: {"actionTaken": true}})
        })
        res.sendStatus(200)
    },
    blockedLogin: (req, res, next) => {
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            var db = client.db('OpenWorld');
            var time = Date.now()
            var description = "Someone attempted to login to branch unsuccessfully"
            var logType = "Accounts"
            var type = "Unsuccessful Login"
            var logID = randomstring.generate({length: 12, charset: 'numeric'})
            // 
            // 
            // 
            
            db.collection('logs').insertOne(
                { 
                    "pushUser": {
                        "_id": "Server"
                    },
                    "data": {
                        type,
                        time,
                        description
                    },
                    logType,
                    logID
                    
                }
            )
            
        })

    },
    failedLogin: (req, res, next) => {
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
            assert.equal(null, err);
            var db = client.db('OpenWorld');
            var time = Date.now()
            var description = "Branch Login System was unable to function"
            var logType = "Accounts"
            var type = "login"
            var logID = randomstring.generate({length: 12, charset: 'numeric'})
            // 
            // 
            // 
            
            db.collection('logs').insertOne(
                { 
                    "pushUser": {
                        "_id": "Server"
                    },
                    "data": {
                        type,
                        time,
                        description
                    },
                    logType,
                    logID
                    
                }
            )
            
        })

    },
}
