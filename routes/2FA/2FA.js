const colors = require('colors');
const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const logs = require('../logs')
const randomstring = require('randomstring')
const speakeasy = require('speakeasy');
var QRCode = require('qrcode');

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true },  function(err, client) {
    var db = client.db('OpenWorld');
    assert.equal(null, err);
    function getArr() {
        return new Promise(function(resolve,reject) {
            var data = db.collection('users').find({"TFAPerm": true}).toArray()
            data.then(function(result) {
                resolve(result)
            })
        })
    }
    async function run() {
        var arr1 = await getArr()
    
    }
    
    run();
})


/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user) {
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true },  function(err, client) {
            var db = client.db('OpenWorld');
            assert.equal(null, err);
            function getArr() {
                return new Promise(function(resolve,reject) {
                    var data = db.collection('users').find({"email": req.user.email}).toArray()
                    data.then(function(result) {
                        resolve(result)
                    })
                })
            }
            async function run() {
                var arr1 = await getArr()
                
                var user = arr1[0]
                var date = Date.now()
                
                res.render('2FA')
                
            }
            
            run();
        })
    } else {
        res.redirect("/")
    }
});

router.post('/db/user/update', function(req, res, next){
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        assert.equal(null, err);
        var db = client.db('OpenWorld');
        var md1 = "pending"
        var md2 = "pending"
        var date = Date.now()
        if(req.body.authentication == "authy") {
            var secret = speakeasy.generateSecret({length: 20});
            md1 = secret.base32
            md2 = secret.otpauth_url
        }
        console.log(md1 + " " + md2)
        db.collection('users').updateOne(
            {
            'email': req.user.email
            }, 
            { $set: {
                
            "TFA": {
                "method": req.body.authentication,
                "metadata": md1,
                "metadata2": md2,
                "lastChecked": date
            }
            
        }})
        res.send(md2)
    })
})

router.post('/verified', function(req, res, next) {
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        assert.equal(null, err);
        var db = client.db('OpenWorld');
        var time = Date.now()
            var description = "A User has setup 2FA"
            var logType = "Accounts"
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
                        "type": "2FA",
                        time,
                        description
                    },
                    logID,
                    logType
                    
                }
            )
        
        db.collection('users').updateOne({'email': req.user.email}, {$set: {"checks.completedSecurityIntro": true}})
    })
    res.sendStatus(200)
})

router.post('/verify', function(req, res, next){
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        var db = client.db('OpenWorld');
        assert.equal(null, err);
        function getArr() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('users').find({"email": req.user.email}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        async function run() {
            var arr1 = await getArr()
            
            // This is provided the by the user via form POST
            var userToken = req.body.val
            
            // Load the secret.base32 from their user record in database
            var secret = arr1[0].TFA.metadata
            // Verify that the user token matches what it should at this moment
            var verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: userToken
            });
            var date = Date.now()
            if(verified) {
                logs.login(req, res, next)
                db.collection('users').updateOne({'email': req.user.email}, {$set: {"TFA.lastChecked": date}})
                res.send('verified')
            } else {
                logs.blockedLogin(req, res, next)
                res.send('unverified')
            }
        }
        
        run();
    })
})

router.post('/verification', function(req, res, next){
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, client) {
        var db = client.db('OpenWorld');
        assert.equal(null, err);
        function getArr() {
            return new Promise(function(resolve,reject) {
                var data = db.collection('users').find({"email": req.user.email}).toArray()
                data.then(function(result) {
                    resolve(result)
                })
            })
        }
        async function run() {
            var arr1 = await getArr()
            
            // This is provided the by the user via form POST
            var userToken = req.body.val
            
            // Load the secret.base32 from their user record in database
            var secret = arr1[0].TFA.metadata
            
            // Verify that the user token matches what it should at this moment
            var verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: userToken
            });
            
            var date = Date.now()
            if(verified) {
                db.collection('users').updateOne({'email': req.user.email}, {$set: { "TFA.lastChecked": date}})
                res.send('verified')
            } else {
                res.send('unverified')
            }
        }
        
        run();
    })
})

module.exports = router;
