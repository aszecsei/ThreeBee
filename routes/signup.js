'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

var db = require('../src/database');
var User = require('../src/models/user');

/* GET signup page. */
router.get('/', function(req, res, next) {
    res.render('signup', {shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0)});
});+

// process the signup form
router.post('/', function(req, res) {
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
            newUser.email    = req.body.email;
            newUser.password = "";
            newUser.user_type = 1;
            newUser.auth_status = 0;

            // save the user
            newUser.save(function(err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                newUser.id = id;

                // Now, save the auth token
                db.query("INSERT INTO `auth_keys` (`user_id`, `auth_key`) VALUES (?, ?)", [newUser.id, newUser.generateToken()], function(err) {
                    if(err) {
                        throw err;
                    }

                    res.redirect("/signup/success");
                });
            });
        }
    });
});

router.get('/:id', function(req, res, next) {
    //
});

module.exports = router;
