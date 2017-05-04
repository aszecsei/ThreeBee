'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../src/models/user');
var email = require('../src/email');
var auth = require('../src/auth');
var db = require('../src/database');

var errorHandle = function(res, message) {
    res.status(500).json(message);
};

router.get('/forgotpassword', function(req, res) {
    if(req.user) {
        res.redirect("/");
    } else {
        res.render('forgotpassword', {shouldDisplayLogin: 0});
    }
});

router.post('/forgotpassword', function(req, res) {
    if(req.user) {
        res.redirect("/");
    } else {
        db.query("SELECT * FROM users WHERE email=? AND deleted=0", [req.body.email], function(err, results) {
            if(err) {
                errorHandle(res, "There was a problem with the database. Please try again in a few minutes.");
            }else if(results.length == 0) {
                errorHandle(res, "There is no registered user with this email address.");
            } else {
                if(results[0].user_type == 1) {
                    var user = new User();
                    // Change the password to a sample one and email it to the user
                    var pass = user.generateTempPass();
                    var hashedPass = user.generateHash(pass);
                    newUser.email    = req.body.email;

                    db.query("UPDATE users SET (password=?, auth_status=0) WHERE email=?", [hashedPass, req.body.email], function(err, result) {
                        email.sendMail(newUser.email, "Your ThreeBee Account", "Hello!\n\nYour account with ThreeBee Airlines has had its password reset. To log in, please use this email and the password: '" + pass + "'.", function() {
                            res.json({message: "Success"});
                        });
                    });

                } else {
                    // Create a URL to authorize a password change
                    var user = new User();
                    db.query("UPDATE users set (auth_status=0) WHERE email=?", [req.body.email], function(err, result) {
                        // Delete any auth tokens for the user
                        db.query("DELETE FROM `auth_keys` WHERE user_id=?", [results[0].user_id], function(err) {
                            // Save the auth token
                            var authToken = user.generateToken();
                            db.query("INSERT INTO `auth_keys` (`user_id`, `auth_key`) VALUES (?, ?)", [results[0].user_id, authToken], function (err) {
                                if (err) {
                                    errorHandle(res, err);
                                } else {
                                    email.sendMail(req.body.email, "Authenticate Your ThreeBee Account", "Your account with ThreeBee Airlines has had its password reset.\n\nIf this is you, please either click the link or paste it into your browser: <a href='http://localhost:3000/signup/" + authToken + "'>http://localhost:3000/signup/" + authToken + "</a>", function () {
                                        res.json({message: 'Success'});
                                    });
                                }
                            });
                        });
                    });
                }
            }
        });
    }
});

/* GET manager change password page. */
router.get('/changepassword', function(req, res) {
    if(req.user)
        res.render('changepassword', {shouldDisplayLogin: 1, required: req.user.user_type == 1 && req.user.auth_status == 0, loggedInName: "Manager"});
    else
        res.redirect("/");
});

router.post('/changepassword', function(req, res) {
    var usr = new User();
    if(usr.checkPass(req.body.password)) {
        if (req.user && ((req.user.user_type == 1 && req.user.auth_status == 0) || req.user.auth_status == 1)) {
            usr = req.user;
            usr.password = usr.generateHash(req.body.password);
            usr.auth_status = 1;
            usr.update(function (err, id) {
                if (err) {
                    errorHandle(res, err);
                } else {
                    res.json({message: 'Password changed'});
                }
            });
        } else {
            errorHandle(res, "You are not authorized to perform this action.")
        }
    } else {
        errorHandle(res, "Passwords must be at least 8 characters long, and must contain at least one uppercase letter, lowercase letter, and letter.");
    }
});

module.exports = router;