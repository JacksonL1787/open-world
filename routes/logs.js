const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const fs = require('fs')

module.exports = {
    login: (req, res, next) => {
        if(req.user) {
            MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                assert.equal(null, err);
                var db = client.db('OpenWorld');
                
                // 
                // DATA POINTS
                // 
                var type = "login"
                var time = Date.now()
                var description = "User has logged into their account"
                var logType = "account"
                // 
                // 
                // 
                
                db.collection('logs').insert(
                    { 
                        "pushUser": {
                            "firstName": req.user.firstName,
                            "lastName": req.user.lastName,
                            "email": req.user.email,
                            "position": req.user.position,
                            "permission": req.user.permission,
                            "_id": req.user._id,
                            "profilePicture": req.user.profilePicture
                        },
                        "data": {
                            type,
                            time,
                            description
                        },
                        logType
                        
                    }
                )
            })
        } else {
            res.redirect('/')
            req.flash('You Need To Login First')
        }
    }
}