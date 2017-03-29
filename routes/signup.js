'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

var db = require('../src/database');
var User = require('../src/models/user');


var email = require('../src/email');

var errorHandle = function(res, message) {
    res.status(500).json(message);
};

/* GET signup page. */
router.get('/', function(req, res) {
    res.render('signup', {shouldDisplayLogin: 2});
});

// process the signup form
router.post('/', function(req, res) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email' :  req.body.email }, function(err, user) {
        // if there are any errors, return the error
        if (err) {
            errorHandle(res, err);
        } else if (user) { // check to see if theres already a user with that email
            errorHandle(res, "A user with that email already exists.");
        } else {
            // if there is no user with that email
            // create the user
            var newUser            = new User();

            // set the user's local credentials
            newUser.email    = req.body.email;
            newUser.password = "";
            newUser.user_type = 0; // Normal user
            newUser.auth_status = 0;

            // save the user
            newUser.save(function(err, id) {
                if (err) {
                    errorHandle(res, err);
                } else {
                    newUser.id = id;

                    // Now, save the auth token
                    var authToken = newUser.generateToken();
                    db.query("INSERT INTO `auth_keys` (`user_id`, `auth_key`) VALUES (?, ?)", [newUser.id, authToken], function (err) {
                        if (err) {
                            errorHandle(res, err);
                        } else {
                            email.sendMail(newUser.email, "Authenticate Your ThreeBee Account", "We recently received a registration for ThreeBee Airlines associated with this account.\n\nIf this is you, please either click the link or paste it into your browser: <a href='http://localhost:3000/signup/" + authToken + "'>http://localhost:3000/signup/" + authToken + "</a>", function () {
                                res.json({message: 'Successfully registered'})
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/:auth', function(req, res) {
    // Check if it's a valid auth key
    var auth = req.params.auth;
    db.query("SELECT * FROM `auth_keys` WHERE `auth_key` = ?", auth, function(err, results) {
        if(err)
            throw err;

        if(results.length > 0) {
            // We're gonna authorize the user
            res.render('authorize', {authKey: auth, shouldDisplayLogin:2});
        }
    });
});

router.post('/:auth', function(req, res) {
    var usr = new User();
    if(usr.checkPass(req.body.password)) {

        var auth = req.params.auth;

        db.query("SELECT * FROM `auth_keys` WHERE `auth_key` = ?", auth, function (err, results) {
            if (err) {
                errorHandle(res, err);
            } else if (results.length > 0) {
                // We're gonna authorize the user!
                var userid = results[0].user_id;

                db.query("DELETE FROM `auth_keys` WHERE `auth_key`=?", auth, function (err) {
                    if (err) {
                        errorHandle(res, err);
                    } else {

                        var usr = User.findById(userid);
                        usr.auth_status = 1;
                        usr.password = usr.generateHash(req.body.password);
                        usr.update(function (err, newID) {
                            if (err) {
                                errorHandle(res, err);
                            } else {
                                res.json({message: 'Successfully authorized'});
                            }
                        });
                    }
                });
            }
        });
    } else {
        errorHandle(res, "Passwords must be at least 8 characters long, and must contain at least one uppercase letter, lowercase letter, and letter.");
    }
});

module.exports = router;
