'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../src/models/user');


var email = require('../src/email');

var auth = require('../src/auth');
var db = require('../src/database');

// process the signup form
router.post('/signup', auth.isAdmin, function(req, res) {
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
                    res.json(newUser);
                });
            });
        }
    });
});

// Handle deleting managers
router.delete("/:id", auth.isAdmin, function(req, res) {
    db.query("SELECT * FROM `USERS` WHERE `user_id`=? AND `user_type`=1", [req.params.id], function(err, row) {
        if(err) {
            console.log("Error!");
            res.send(err);
        } else if(row.length > 0) {
            var user = new User(row[0].user_id, row[0].email, row[0].password, row[0].user_type, row[0].auth_status, row[0].deleted);
            user.deleted = 1;
            user.update(function(err, id) {
                console.log("4");
                if(err) {
                    res.send(err);
                } else {
                    res.json({message: 'Successfully deleted'});
                }
            });
        } else {
            console.log("Error! No manager found!");
            res.send(new Error("No manager found"));
        }
    });
});

module.exports = router;
