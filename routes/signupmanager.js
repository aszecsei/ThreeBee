'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../src/models/user');


var email = require('../src/email');

var auth = require('../src/auth');

/* GET signup page. */
router.get('/', auth.isManager, function(req, res) {
    res.render('managersignup', {shouldDisplayLogin: 2});
});

// process the signup form
router.post('/', auth.isManager, function(req, res) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email' :  req.body.email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
            res.status(400);

        // check to see if theres already a user with that email
        if (user) {
            res.status(400);
        } else {
            // if there is no user with that email
            // create the user
            var newUser            = new User();

            // set the user's local credentials
            var pass = newUser.generateTempPass();
            newUser.email    = req.body.email;
            newUser.password = newUser.generateHash(pass);
            newUser.user_type = 1; // Manager
            newUser.auth_status = 0;

            // save the user
            newUser.save(function(err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                newUser.id = id;

                // Now, send the email!
                email.sendMail(newUser.email, "Your ThreeBee Account", "Hello!\n\nYou've recently been given a manager account at ThreeBee Airlines. To log in, please use this email and the password: '" + pass + "'.", function() {
                    res.render('managerlanding', {shouldDisplayLogin: 2});
                });
            });
        }
    });
});

/* GET manager change password page. */
router.get('/changepassword', function(req, res) {
    if(req.user.user_type == 1 && req.user.auth_status == 0)
        res.render('managerchangepassword', {shouldDisplayLogin: 2});
    else
        res.redirect("/");
});

router.post('/changepassword', function(req, res) {
    if(req.user.user_type == 1 && req.user.auth_status == 0) {
        var usr = req.user;
        usr.password = usr.generateHash(req.body.password);
        usr.auth_status = 1;
        usr.update(function(err, id) {
            if(err)
                throw err;
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;