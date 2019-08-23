const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring')

module.exports = {
    updateAll: (req, res, next) => {
        if(req.user) {
            if(req.user.permission == "admin") {
                MongoClient.connect("mongodb://localhost:27017", function(err, client) {
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
                    function getArr2() {
                        return new Promise(function(resolve,reject) {
                            var data = db.collection('logs').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                   
                    async function run() {
                        var graphs = await getArr()
                        var logs = await getArr2()
                        var prevNum = 0
                        var numLogins = 0 - prevNum
                        // count DPT
                        for(var i = 0; i < logs.length; i++) {
                            if(logs[i].data.type == "login") {
                                numLogins++
                            }
                        }
                        
                        // UPDATE GRAPHS
                        db.collection('graphs').updateOne({'graph': "loginAct"}, { $set: {"currentData": numLogins.toString()}})
                    }
                    
                    run();
                })
            } else {
                res.redirect('/dashboard')
            }
        } else {
            res.redirect('/')
        }
    },
}