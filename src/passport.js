/* passport.js */

'use strict';

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('./models/user');

var passport = require('passport');

// expose this function to our app using module.exports
module.exports = function() {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP (USER) =====================================================
    // =========================================================================

    passport.use('local-signup-user', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false);
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();

                    // set the user's local credentials
                    newUser.email    = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.user_type = 1;

                    // save the user
                    newUser.save(function(err, id) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        newUser.id = id;
                        return done(null, newUser);
                    });
                }

            });
        }));
};