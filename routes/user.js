'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../src/models/user');


var email = require('../src/email');

var auth = require('../src/auth');

var errorHandle = function(res, message) {
    res.status(500).json(message);
};

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