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
                userinfoList: userinfoList,
                user: user
            });
        });

    })
});

// process the update userinfo form
router.post('/', function(req, res) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email' :  req.body.email }, function(err, user) {

        // if there are any errors, return the error
        if (err) {

            errorHandle(res, err);
        } else if (user) { // check to see if theres already a user with that email

            // set the user's local credentials
            user.email    = req.body.email;
            user.first_name = req.body.firstName;
            user.last_name = req.body.lastName;
            user.street_addr = req.body.address;
            user.zip = req.body.zipCode;
            user.city = req.body.city;
            user.state = req.body.state;
            user.country = req.body.country;


            user.updateUserInfo( function(err) {

                if (err){
                    errorHandle(err);
                }

            });

        }
    });
});


module.exports = router;