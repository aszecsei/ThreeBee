'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', {shouldDisplayLogin: false});
});

// process the login form
router.post('/', passport.authenticate('local-login-user'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    if(req) {
        res.send({user: req.user});
    } else {
        res.status(401);
    }
});

module.exports = router;
