const MongoClient = require('mongodb').MongoClient;
const assert = require("assert")
const fs = require('fs')

module.exports = {
    dashboardRouter: (req, res, next) => {
        if(req.user) {
            if(req.user.permission == "admin") {
                res.redirect('/admin/home')
            }
            if(req.user.permission == "teacher") {
                res.redirect('/teacher/home')
            }
        } else {
            res.redirect('/')
        }
    }
}