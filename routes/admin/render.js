const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const fs = require('fs')

module.exports = {
    schoolAccounts: (req, res, next) => {
        if(req.user) {
            if(req.user.permission == "admin") {
                MongoClient.connect("mongodb://localhost:27017", function(err, client) {
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
                            var data = db.collection('logs').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                    function getArr3() {
                        return new Promise(function(resolve,reject) {
                            var data = db.collection('graphs').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                    function getArr4() {
                        return new Promise(function(resolve,reject) {
                            var data = db.collection('students').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                    async function renderPage() {
                        var arr1 = await getArr()
                        var arr2 = await getArr2()
                        var arr3 = await getArr3()
                        var arr4 = await getArr4()
                        res.render('admin/accounts', {user: req.user, userDB: JSON.stringify(arr1), logs: JSON.stringify(arr2), graphs: JSON.stringify(arr3), students: JSON.stringify(arr4)})
                    }
                    
                    renderPage();
                })
            } else {
                res.redirect('/dashboard')
            }
        } else {
            res.redirect('/')
        }
    },
    
    studentBuilder: (req, res, next) => {
        if(req.user) {
            if(req.user.permission == "admin") {
                MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                    var db = client.db('OpenWorld');
                    assert.equal(null, err);
                    function getArr() {
                        return new Promise(function(resolve,reject) {
                            var data = db.collection('classes').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                    function getArr2() {
                        return new Promise(function(resolve,reject) {
                            var data = db.collection('advisors').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                    async function renderPage() {
                        var arr1 = await getArr()
                        var arr2 = await getArr2()
                        res.render('admin/accountBuilders/studentAccount', {user: req.user, title: "Admin Builder", classDB: JSON.stringify(arr1), advisorDB: JSON.stringify(arr2)})
                    }
                    
                    renderPage();
                })
            } else {
                res.redirect('/dashboard')
            }
        } else {
            res.redirect('/')
        }
    },
    
    schoolControls: (req, res, next) => {
        if(req.user) {
            if(req.user.permission == "admin") {
                MongoClient.connect("mongodb://localhost:27017", function(err, client) {
                    var db = client.db('OpenWorld');
                    assert.equal(null, err);
                    function getArr() {
                        return new Promise(function(resolve,reject) {
                            var data = db.collection('classrooms').find({}).toArray()
                            data.then(function(result) {
                                resolve(result)
                            })
                        })
                    }
                    async function renderPage() {
                        var arr1 = await getArr()
                        res.render('admin/schoolControls', {user: req.user, title: "Admin Controls", classrooms: JSON.stringify(arr1)})
                    }
                    
                    renderPage();
                })
            } else {
                res.redirect('/dashboard')
            }
        } else {
            res.redirect('/')
        }
    },
}