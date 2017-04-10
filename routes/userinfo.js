'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

var db = require('../src/database');
var User = require('../src/models/user');

var errorHandle = function(res, message) {
    res.status(500).json(message);
};

router.get('/',function(req, res) {
    console.log(req.user.id);
    //user.lookupUserInfo();
    User.findOne({ 'user_id' :  req.user.id }, function(err, user) {
        var results = user.lookupUserInfo( function(err, results){
            if(err) {
                errorHandle(err);
            }
            var userinfoList = [];
            for(var i=0; i<results.length; i++) {
                userinfoList = userinfoList.concat(results[i]);
            }

            res.render('userinfo', {
                shouldDisplayLogin: 2,
                userinfoList: userinfoList
            });
        });

    })
});

module.exports = router;