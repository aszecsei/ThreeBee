'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

/* GET signup page. */
router.get('/', function(req, res, next) {
    res.render('signup');
});

// process the signup form
router.post('/', passport.authenticate('local-signup-user'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    if(req) {
        res.send({user: req.user});
    } else {
        res.status(401);
    }
});

module.exports = router;
