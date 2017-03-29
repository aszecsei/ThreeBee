'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../src/models/user');


var email = require('../src/email');

var auth = require('../src/auth');

/* GET manager change password page. */
router.get('/changepassword', function(req, res) {
    if(req.user)
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