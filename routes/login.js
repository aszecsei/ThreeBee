'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');


/* GET login page. */
router.get('/', function(req, res, next) {
    var msg = req.flash('message');
    console.log(msg);
    res.render('login', {shouldDisplayLogin: 2, message: msg});
});

// process the login form
router.post('/', passport.authenticate('local-login-user', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

module.exports = router;