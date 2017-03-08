'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.user.user_type == 1 && req.user.auth_status == 0) {
    res.redirect('/signupmanager/changepassword');
  }

  res.render('index', { title: 'ThreeBee', body: 'We be three bees! Alic, Emma, and Tanner.', shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0) });
});

module.exports = router;
